import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpWrapperService } from '../../services/api-service.service';
import { Api } from '../../services/api-enums';

@Component({
  selector: 'app-my-dash',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-dash.component.html',
  styleUrl: './my-dash.component.css'
})
export class MyDashComponent implements OnInit{
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
        }
      })
    }
    getFirstName(fullName) {
      if (!fullName) return '';
      return fullName.trim().split(' ')[0];
    }
}
