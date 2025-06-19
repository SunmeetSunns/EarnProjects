import { Component, OnInit } from '@angular/core';
import { HttpWrapperService } from '../../services/api-service.service';
import { Api } from '../../services/api-enums';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-plans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-plans.component.html',
  styleUrl: './my-plans.component.css'
})
export class MyPlansComponent implements OnInit{
  noData: boolean=false;
  ngOnInit(): void {
    this.fetchUserPlan()
  }
userPlanData:any;
constructor(private ApiService:HttpWrapperService,private router:Router){}
fetchUserPlan(){
 
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      let body = {
        userId: user?._id
      }
      this.ApiService.post(Api.findPlan, body).subscribe((res: any) => {
        if (res?.Status == 200) {
          this.userPlanData = res;
        }
        if(res?.status==201){
         
          this.userPlanData=res;
          this.noData=true;
        }
      })
    }
goToPlans(){
  this.router.navigate(['/plans/all'])
}
}
