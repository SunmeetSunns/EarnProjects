import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-review-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-detail.component.html',
  styleUrl: './review-detail.component.css'
})
export class ReviewDetailComponent implements OnInit{
  planDetails: any;
  fieldData: any;

  ngOnInit(): void {
    const fieldData=JSON.parse(sessionStorage.getItem('overallData'))
    const planDetails=JSON.parse(sessionStorage.getItem('selectedPlan'))
    this.planDetails=planDetails
    this.fieldData=fieldData
    console.log(planDetails)
    console.log(fieldData)
    
  }
  formatDate(dateStr: string): string {
  if (!dateStr) return '';

  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }); // Output: 01 May 2025
}

activeSection: 'additional' | 'declaration' | null = null;

toggleSection(section: 'additional' | 'declaration') {
  this.activeSection = this.activeSection === section ? null : section;
}

}
