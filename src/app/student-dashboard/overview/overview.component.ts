import { Component, OnInit } from '@angular/core';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { CommonModule } from '@angular/common';
import { HttpWrapperService } from '../../services/api-service.service';
import { Api } from '../../services/api-enums';
import { MyDashComponent } from "../my-dash/my-dash.component";
import { MyPlansComponent } from '../my-plans/my-plans.component';
import { BankDetailsComponent } from "../bank-details/bank-details.component";
import { ProjectsComponent } from '../projects/projects.component';
import { SettingComponent } from '../setting/setting.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, MyDashComponent, MyPlansComponent, BankDetailsComponent,ProjectsComponent,SettingComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {

  selectedQuote: string = '';
  quotes: string[] = [
    "Code is like humor. When you have to explain it, it’s bad.",

    "The best way to get started is to quit talking and start coding.",

    "First, solve the problem. Then, write the code.",

    "Talk is cheap. Show me the code.",

    "Great developers never stop learning.",

    "Every bug you fix today is one less headache tomorrow.",

    "Technology will never replace great developers — but great developers will build the tech that does.",

    "You don’t need to know everything. You just need to be curious enough to learn.",

    "Build projects, not just resumes.",

    "Even the best developer was once a beginner who didn’t quit.",

    "Code like your future depends on it — because it probably does.",

    "If it works, ship it. Then improve it.",

    "Small commits lead to big things.",

    "The only difference between a bug and a feature is documentation. 😄",

    "Real growth happens outside your comfort zone – especially in tech."
  ]
  userPlanData: any;
  activePlan: string='profile';
  ngOnInit(): void {
    const randomIndex = Math.floor(Math.random() * this.quotes.length);
    this.selectedQuote = this.quotes[randomIndex];
    this.getUserDetails();
  }
  constructor(private ApiService: HttpWrapperService) {

  }
  getUserDetails() {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    let body = {
      userId: user?._id
    }
    this.ApiService.post(Api.getUserDetails, body).subscribe((res: any) => {
      if (res?.Status == 200) {
        this.userPlanData = res;
        console.log(this.userPlanData)
      }
    })
  }
  getFirstName(fullName) {
    if (!fullName) return '';
    return fullName.trim().split(' ')[0];
  }
  changeModule(action: any) {
    if (action == 'profile') {
      this.activePlan = 'profile'
    }
    if (action == 'plans') {
      this.activePlan = 'plan'
    }
    if (action == 'projects') {
      this.activePlan = 'projects'
    }
    if (action == 'bank-details') {
      this.activePlan = 'bank-details'
    }
    if (action == 'settings') {
      this.activePlan = 'settings'
    }
    console.log(this.activePlan)
  }
}
