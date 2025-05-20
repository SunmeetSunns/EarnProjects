import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Plan } from '../../app/models/plan';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.css'
})
export class PlansComponent implements OnInit{
 allPlans: Plan[] = [
    {
      name: 'Student Starter',
      price: 4999,
      yearlyDiscount: 'Save ₹989.00 annually',
      category: 'student',
      description: 'Perfect for students starting their journey',
      features: [
        '2-3 project leads per month',
        'Basic project filtering',
        'Email support',
        'Project completion certificates',
        'Basic skill assessment',
        'Community access',
      ],
      popular: false
    },
    {
      name: 'Student Pro',
      price: 9999,
      yearlyDiscount: 'Save ₹1989.00 annually',
      category: 'student',
      description: 'For serious students ready to excel',
      features: [
        '5-7 project leads per month',
        'Advanced project matching',
        'Priority support',
        'Experience letters',
        'Skill development workshops',
        'Mentor connection',
        'Portfolio builder',
      ],
      popular: true
    },
    {
      name: 'Professional Silver',
      price: 14999,
      yearlyDiscount: 'Save ₹2989.00 annually',
      category: 'professional',
      description: 'For working professionals seeking growth',
      features: [
        '7-10 project leads per month',
        'Advanced project filtering',
        'Priority support',
        'Client communication tools',
        'Professional profile badge',
        'Training programs access',
      ],
      popular: false
    },
    {
      name: 'Agency Max',
      price: 29999,
      yearlyDiscount: 'Save ₹4989.00 annually',
      category: 'agency',
      description: 'For agencies managing multiple professionals',
      features: [
        'Unlimited project leads',
        'Team management tools',
        'Dedicated support',
        'Invoice & billing system',
        'Custom branding',
        'Agency analytics dashboard',
      ],
      popular:true
    }
    ,
    {
      name: 'Agency Max',
      price: 29999,
      yearlyDiscount: 'Save ₹4989.00 annually',
      category: 'agency',
      description: 'For agencies managing multiple professionals',
      features: [
        'Unlimited project leads',
        'Team management tools',
        'Dedicated support',
        'Invoice & billing system',
        'Custom branding',
        'Agency analytics dashboard',
      ],
      popular:false
    }
    ,
    {
      name: 'Agency Max',
      price: 29999,
      yearlyDiscount: 'Save ₹4989.00 annually',
      category: 'agency',
      description: 'For agencies managing multiple professionals',
      features: [
        'Unlimited project leads',
        'Team management tools',
        'Dedicated support',
        'Invoice & billing system',
        'Custom branding',
        'Agency analytics dashboard',
      ],
      popular:true
    }
  ];

  filteredPlans: Plan[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const category = params['category'];
      this.filteredPlans = category === 'all'
        ? this.allPlans
        : this.allPlans.filter(plan => plan.category === category);
    });
  }

}
