import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offerings',
  standalone: true,
  imports: [],
  templateUrl: './offerings.component.html',
  styleUrl: './offerings.component.css'
})
export class OfferingsComponent implements OnInit {
  ngOnInit(): void {

  }
  constructor(private router: Router) {

  }

  routeToPlans(plan: any) {
  
      this.router.navigate([`/plans/${plan}`]);
   
  }
}
