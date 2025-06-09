import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router) {

  }
  ngOnInit(): void {
    if (!sessionStorage.getItem('user') && !sessionStorage.getItem('planPurchased')) {
      this.router.navigate(['/'])
    }
  }
}
