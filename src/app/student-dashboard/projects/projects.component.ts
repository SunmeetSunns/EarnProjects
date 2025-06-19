import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {

  constructor(private router:Router){}
  projectList = [
  {
    heading: 'Build a Landing Page for Tech Startup',
    description: 'Design and develop a responsive landing page with form integration and animations.',
    timeline: '3 weeks',
    status: 'Ongoing'
  },
  {
    heading: 'Social Media Marketing Campaign',
    description: 'Run a 1-month campaign to boost product reach on Instagram and LinkedIn.',
    timeline: '1 month',
    status: 'Upcoming'
  },
  {
    heading: 'Payment Gateway Integration',
    description: 'Integrate Razorpay and test for multiple currencies with sandbox/live credentials.',
    timeline: '10 days',
    status: 'Completed'
  }
];

noProjects = true; // change to true to test empty state
ngOnInit(): void {
  
}
goToPlans(){
  this.router.navigate(['/plans/all'])
}
}
