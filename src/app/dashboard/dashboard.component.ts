import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { HttpWrapperService } from '../services/api-service.service';
import { Api } from '../services/api-enums';
import { CommonModule } from '@angular/common';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { LoginServiceService } from '../services/login-service.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  userPlanData: any;
  public doughnutChartLabels: string[] = ['Completed', 'Allotted', 'Pending'];

  public doughnutChartData = {
    labels: this.doughnutChartLabels,
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#ccc', '#ccc', '#ccc'] // will be replaced by gradient
    }]
  };


  public chartOptions = {
    responsive: true,
    cutout: '80%', // Thick ring
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  public doughnutChartType: any = 'doughnut';
  noPlanPurchased: boolean;
  isLoggedIn: boolean;

  constructor(private router: Router, private ApiService: HttpWrapperService, private loginService: LoginServiceService) { }

  ngOnInit(): void {
    this.loginService.isLoggedIn$.subscribe((status: boolean) => {
      this.isLoggedIn = status;
    });
    if (this.isLoggedIn) {
      this.findPlan();
    }
    if (!this.isLoggedIn) {
      this.router.navigate(['/login'])
    }

  }

  ngAfterViewInit(): void {
    this.setGradients(); // setup default gradient
  }

  findPlan() {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const body = {
      userId: user?._id
    };

    this.ApiService.post(Api.findPlan, body).subscribe((res: any) => {
      if (res?.status == 201) {
        this.noPlanPurchased = true;
        return
      }
      this.userPlanData = res?.planPurchased;

      // 👇 example: assuming API returns counts like this:
      const completed = this.userPlanData?.completedProj || 0;
      const allotted = this.userPlanData?.fullFormData?.noOfProj || 0;
      const pending = this.userPlanData?.pendingProj || 0;

      // update chart data
      this.doughnutChartData.datasets[0].data = [completed, allotted, pending];

      this.setGradients(); // re-apply gradient once chart is updated
      this.chart?.update();
    });
  }

  setGradients() {
    const chartRef = this.chart?.chart;
    if (!chartRef) return;

    const ctx = chartRef.ctx;
    const gradient1 = ctx.createLinearGradient(0, 0, 300, 0);
    gradient1.addColorStop(0, '#9c75e1');
    gradient1.addColorStop(1, '#7286d0');

    const gradient2 = ctx.createLinearGradient(0, 0, 300, 0);
    gradient2.addColorStop(0, '#7286d0');
    gradient2.addColorStop(1, '#43aaa6');

    const gradient3 = ctx.createLinearGradient(0, 0, 300, 0);
    gradient3.addColorStop(0, '#43aaa6');
    gradient3.addColorStop(1, '#9c75e1');
    this.doughnutChartData.datasets[0].backgroundColor = [
      gradient1 as any,
      gradient2 as any,
      gradient3 as any
    ];

  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}
