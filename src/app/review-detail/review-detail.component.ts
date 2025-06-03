import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-review-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-detail.component.html',
  styleUrl: './review-detail.component.css'
})
export class ReviewDetailComponent implements OnInit {
  planDetails: any;
  fieldData: any;
  agencyFields: { field: string; value: any; }[];
  professionalFieldsStep2: { field: string; value: any; }[];
  agencyFieldsStep2: { field: string; value: any; }[];
  professionalFields: { field: string; value: any; }[];

  ngOnInit(): void {
    const fieldData = JSON.parse(sessionStorage.getItem('overallData'))
    const planDetails = JSON.parse(sessionStorage.getItem('selectedPlan'))
    this.planDetails = planDetails
    this.fieldData = fieldData
    console.log(planDetails)
    console.log(fieldData)
    this.populateData()
  }
  constructor(private router:Router){

  }
  populateData() {
    this.studentFields = [
      { field: 'College', value: this.fieldData?.college },
      { field: 'Course', value: this?.fieldData?.course },
      { field: 'Year of Study', value: this.fieldData?.yearOfStudy },
      { field: 'Tech Stack', value: this.fieldData?.techStack }
    ];
    this.studentFieldsStep2 = [
      {
        field: 'Availability',
        value: this.fieldData?.availability,
      },
      {
        field: 'Preferred Learning Area',
        value: this.fieldData?.preferredLearningAreas,
      },
      {
        field: 'Language Comfort',
        value: this.fieldData?.languageComfort,
      }
    ];
    this.agencyFields = [
      {
        field: 'Team Size',
        value: this.fieldData?.teamSize,
      },
      {
        field: 'Poc Name',
        value: this.fieldData?.pocName,
      },
      {
        field: 'Poc Email',
        value: this.fieldData?.pocEmail,
      },
      {
        field: 'Poc PhoneNumber',
        value: this.fieldData?.pocPhoneNumber,
      },
      {
        field: 'Tech Stack',
        value: this.fieldData?.techStack,
      },
      {
        field: 'Core Services',
        value: this.fieldData?.coreServices,
      }
    ];
    this.professionalFieldsStep2 = [
      {
        field: 'Availability',
        value: this.fieldData?.availability,
      },
      {
        field: 'Preferred Project Type',
        value: this.fieldData?.preferredProjectType,
      },
      {
        field: 'Language Comfort',
        value: this.fieldData?.languageComfort,
      }
    ];
    this.agencyFieldsStep2 = [
      {
        field: 'Team Capacity',
        value: this.fieldData?.teamCapacity,
      },
      {
        field: 'Past Clients',
        value: this.fieldData?.pastClients,
      },
      {
        field: 'Budget Range',
        value: this.fieldData?.budgetRange,
      },
      {
        field: 'Communication Tools',
        value: this.fieldData?.communicationTools,
      },
      {
        field: 'Sales Help Required',
        value: this.fieldData?.salesHelpRequired,
      }
    ];
    this.professionalFields = [
      {
        field: 'Years of Experience',
        value: this.fieldData?.yearsOfExperience
      },
      {

        field: 'Total Work Experience',
        value: this.fieldData?.totalWorkExperience
      },
      {

        field: 'Project Descriptions',
        value: this.fieldData?.projectDescriptions
      }
    ];


  }
  editDetails(){
    const forEdit=true
    sessionStorage.setItem('forEdit',forEdit.toString())
    this.router.navigate(['/proceed-form'])
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
  studentFields: any = [];
  studentFieldsStep2: any = [];
  activeSection: 'additional' | 'declaration' | null = null;

  toggleSection(section: 'additional' | 'declaration') {
    this.activeSection = this.activeSection === section ? null : section;
  }

}
