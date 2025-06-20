import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpWrapperService } from '../../services/api-service.service';
import { Api } from '../../services/api-enums';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-my-plans',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './my-plans.component.html',
  styleUrl: './my-plans.component.css'
})
export class MyPlansComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  noData: boolean = false;
  public doughnutChartLabels: string[] = ['Completed', 'Allotted', 'Pending'];
  public doughnutChartType: any = 'doughnut';
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
  ngOnInit(): void {
    this.fetchUserPlan()
  }
  userPlanData: any;
  constructor(private ApiService: HttpWrapperService, private router: Router) { }
  fetchUserPlan() {

    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    let body = {
      userId: user?._id
    }
    this.ApiService.post(Api.findPlan, body).subscribe((res: any) => {
      if (res?.status == 200) {
        this.userPlanData = res?.planPurchased;
        console.log(res);
        const completed = this.userPlanData?.completedProj || 0;
        const allotted = this.userPlanData?.fullFormData?.noOfProj || 0;
        const pending = this.userPlanData?.pendingProj || 0;
        this.doughnutChartData.datasets[0].data = [completed, allotted, pending];

        this.setGradients(); // re-apply gradient once chart is updated
        this.chart?.update();
      }
      if (res?.status == 201) {

        this.userPlanData = res;
        this.noData = true;
      }
    })
  }
  formatDateToReadable(dateStr: string): string {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    };
    return date.toLocaleDateString('en-GB', options);
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
  goToPlans() {
    this.router.navigate(['/plans/all'])
  }
}
