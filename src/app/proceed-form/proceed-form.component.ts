import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proceed-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './proceed-form.component.html',
  styleUrls: ['./proceed-form.component.css'], // kept unchanged
})
export class ProceedFormComponent implements OnInit {
  form!: FormGroup;
  stepIndex = 0;

  // You can dynamically set this.plan via Input() or another way as needed
  plan: 'student' | 'professional' | 'agency';
  selectedPlanDetails: any;
  amtToPaid: any;
  Overalldata: any;
  noOfProj: number;
  yearlyDiscount: number;
  payFrequency: string = 'Monthly';

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.fillPlanDetails()
    this.initializeForm();
    this.applyPlanBasedValidators(this.plan);
    this.patchUserDetails();
    if (sessionStorage.getItem('forEdit')) {
      this.patchValuesForEdit();
    }
    
  }
patchUserDetails() {
  if (sessionStorage.getItem('user')) {
    const data = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (!data) return;

    this.form.patchValue({
      step0: {
        fullName: data.name || '',
        email: data.email || '',
        phoneNumber: data.mobile || '',
      },
      step1: {
        pocName: data.name || '',
        pocEmail: data.email || '',
        pocPhoneNumber: data.mobile || '',
      },
    });

    // ✅ Use .disable()
    this.form.get('step0.fullName')?.disable();
    this.form.get('step0.email')?.disable();
    this.form.get('step0.phoneNumber')?.disable();

    this.form.get('step1.pocName')?.disable();
    this.form.get('step1.pocEmail')?.disable();
    this.form.get('step1.pocPhoneNumber')?.disable();
  }
}

  patchValuesForEdit() {
    const data = JSON.parse(sessionStorage.getItem('overallData') || '{}');
    if (!data) return;

    this.form.patchValue({
      step0: {
        city: data.city || '',
        dob: data.dob || '',
        agencyName: data.agencyName || '',
        website: data.website || '',
        location: data.location || '',
      },
      step1: {
        college: data.college || '',
        course: data.course || '',
        yearOfStudy: data.yearOfStudy || '',
        techStack: data.techStack || '',
        portfolioLink: data.portfolioLink || '',
        githubProfile: data.githubProfile || '',
        linkedinProfile: data.linkedinProfile || '',

        yearsOfExperience: data.yearsOfExperience || '',
        totalWorkExperience: data.totalWorkExperience || '',
        projectDescriptions: data.projectDescriptions || '',
        resume: data.resume || '',

        teamSize: data.teamSize || '',
        coreServices: data.coreServices || '',
      },
      step2: {
        availability: data.availability || '',
        preferredLearningAreas: data.preferredLearningAreas || '',
        languageComfort: data.languageComfort || '',

        preferredProjectType: data.preferredProjectType || '',

        teamCapacity: data.teamCapacity || '',
        pastClients: data.pastClients || '',
        budgetRange: data.budgetRange || '',
        communicationTools: data.communicationTools || '',
        salesHelpRequired: data.salesHelpRequired || 'false',
      }
      
    });
      this.form.get('step0.fullName')?.disable();
    this.form.get('step0.email')?.disable();
    this.form.get('step0.phoneNumber')?.disable();

    this.form.get('step1.pocName')?.disable();
    this.form.get('step1.pocEmail')?.disable();
    this.form.get('step1.pocPhoneNumber')?.disable();
    this.payFrequency = data?.paymentFrequency
    this.amtToPaid = data?.amount
    this.noOfProj = data?.noOfProj
    this.yearlyDiscount = data?.discount


  }

  fillPlanDetails() {
    const PlanDetails = JSON.parse(sessionStorage.getItem('selectedPlan'))
    this.selectedPlanDetails = PlanDetails
    this.plan = this.selectedPlanDetails?.category
  }

  get currentStepGroup(): FormGroup {
    return this.form.get(`step${this.stepIndex}`) as FormGroup;
  }

  initializeForm() {
    this.form = this.fb.group({
      step0: this.fb.group({
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        city: ['', Validators.required],
        dob: ['', Validators.required],
        agencyName: ['', Validators.required],
        website: ['', Validators.required],
        location: ['', Validators.required],
      }),
      step1: this.fb.group({
        // Student
        college: [''],
        course: [''],
        yearOfStudy: [''],
        techStack: [''],
        portfolioLink: [''],
        githubProfile: [''],
        linkedinProfile: [''],

        // Professional
        yearsOfExperience: [''],
        totalWorkExperience: [''],
        projectDescriptions: [''],
        resume: [''],

        // Agency
        teamSize: [''],
        pocName: [''],
        pocEmail: [''],
        pocPhoneNumber: [''],
        coreServices: [''],
        // add resume control for file upload
      }),
      step2: this.fb.group({
        // Student
        availability: [''],
        preferredLearningAreas: [''],
        languageComfort: [''],

        // Professional
        preferredProjectType: [''],


        // Agency
        teamCapacity: [''],
        pastClients: [''],
        budgetRange: [''],
        communicationTools: [''],
        salesHelpRequired: ['false'],
      }),
    });
  }

  applyPlanBasedValidators(plan: string) {
    const step0 = this.form.get('step0') as FormGroup;
    const step1 = this.form.get('step1') as FormGroup;
    const step2 = this.form.get('step2') as FormGroup;

    // Clear all validators first for step0 fields
    Object.keys(step0.controls).forEach((key) => {
      step0.get(key)?.clearValidators();
      step0.get(key)?.updateValueAndValidity();
    });
    // Clear validators for step1 and step2 too similarly (optional but recommended)

    if (plan === 'student') {
      step0.get('fullName')?.setValidators([Validators.required]);
      step0.get('email')?.setValidators([Validators.required, Validators.email]);
      step0.get('phoneNumber')?.setValidators([
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/),
      ]);
      step0.get('city')?.setValidators([Validators.required]);
      step0.get('dob')?.setValidators([Validators.required]);

      // similarly apply validators for step1 and step2 fields for student plan

    } else if (plan === 'professional') {
      step0.get('fullName')?.setValidators([Validators.required]);
      step0.get('email')?.setValidators([Validators.required, Validators.email]);
      step0.get('phoneNumber')?.setValidators([
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/),
      ]);
      step0.get('city')?.setValidators([Validators.required]);
      step0.get('dob')?.setValidators([Validators.required]);
      // validators for step1 professional fields...

    } else if (plan === 'agency') {
      step0.get('agencyName')?.setValidators([Validators.required]);
      step0.get('website')?.setValidators([]); // optional
      step0.get('location')?.setValidators([]); // optional

      // Step1 agency fields:
      ['teamSize', 'pocName', 'pocEmail', 'pocPhoneNumber', 'techStack', 'coreServices'].forEach(
        (field) => {
          step1.get(field)?.setValidators([Validators.required]);
          step1.get(field)?.updateValueAndValidity();
        }
      );

      // Step2 agency fields:
      ['teamCapacity', 'pastClients', 'budgetRange', 'communicationTools', 'salesHelpRequired'].forEach(
        (field) => {
          step2.get(field)?.setValidators([Validators.required]);
          step2.get(field)?.updateValueAndValidity();
        }
      );
    }

    // After setting validators, call updateValueAndValidity for all
    Object.keys(step0.controls).forEach((key) => {
      step0.get(key)?.updateValueAndValidity();
    });
    Object.keys(step1.controls).forEach((key) => {
      step1.get(key)?.updateValueAndValidity();
    });
    Object.keys(step2.controls).forEach((key) => {
      step2.get(key)?.updateValueAndValidity();
    });
  }

  calculateAmt($event: any) {
    var frequency = $event.target.value
    if (frequency == 'Monthly') {
      this.payFrequency = 'Monthly'
      this.amtToPaid = Number(this.selectedPlanDetails?.price)
      this.noOfProj = Number(this.selectedPlanDetails?.noOfLeads)
      this.yearlyDiscount = Number(this.selectedPlanDetails?.yearlyDiscount)
    }
    if (frequency == 'Yearly') {
      this.payFrequency = 'Yearly'
      this.amtToPaid = Number(this.selectedPlanDetails?.price) * 12;
      this.noOfProj = Number(this.selectedPlanDetails?.noOfLeads) * 12;
      this.yearlyDiscount = Number(this.selectedPlanDetails?.yearlyDiscount) * 12
    }

  }
  nextStep() {
    if (this.currentStepGroup.valid && this.stepIndex < 2) {
      this.stepIndex++;
    } else {
      this.currentStepGroup.markAllAsTouched();
    }
  }

  previousStep() {
    if (this.stepIndex > 0) this.stepIndex--;
  }
  studentFields = [
    { field: 'college', label: 'College', type: 'text' },
    { field: 'course', label: 'Course', type: 'dropdown', options: ['B.Tech', 'BCA', 'M.Tech', 'MCA', 'B.Sc IT'] },
    { field: 'yearOfStudy', label: 'Year of Study', type: 'dropdown', options: ['1st Year', '2nd Year', '3rd Year', 'Final Year'] },
    { field: 'techStack', label: 'Tech Stack', type: 'text' }
  ];

  agencyFields = [
    { field: 'teamSize', label: 'Team Size', type: 'dropdown', options: ['1-5', '6-10', '11-20', '20+'] },
    { field: 'pocName', label: 'POC Name', type: 'text' },
    { field: 'pocEmail', label: 'POC Email', type: 'text' },
    { field: 'pocPhoneNumber', label: 'POC Phone Number', type: 'text' },
    { field: 'techStack', label: 'Tech Stack', type: 'text' },
    { field: 'coreServices', label: 'Core Service', type: 'dropdown', options: ['Web Development', 'App Development', 'Design', 'Marketing'] }
  ];

  studentFieldsStep2 = [
    {
      field: 'availability',
      label: 'Availability',
      type: 'dropdown',
      options: ['Part-time', 'Full-time', 'Weekends only']
    },
    {
      field: 'preferredLearningAreas',
      label: 'Preferred Learning Area',
      type: 'dropdown',
      options: ['Frontend', 'Backend', 'Fullstack', 'UI/UX', 'DevOps']
    },
    {
      field: 'languageComfort',
      label: 'Language Comfort',
      type: 'dropdown',
      options: ['English', 'Hindi', 'Both']
    }
  ];
  professionalFieldsStep2 = [
    {
      field: 'availability',
      label: 'Availability',
      type: 'dropdown',
      options: ['Part-time', 'Full-time', 'Freelance']
    },
    {
      field: 'preferredProjectType',
      label: 'Preferred Project Type',
      type: 'dropdown',
      options: ['Web App', 'Mobile App', 'API Development', 'UI/UX']
    },
    {
      field: 'languageComfort',
      label: 'Language Comfort',
      type: 'dropdown',
      options: ['English', 'Hindi', 'Both']
    }
  ];

  agencyFieldsStep2 = [
    {
      field: 'teamCapacity',
      label: 'Team Capacity',
      type: 'dropdown',
      options: ['1-3 Members', '4-6 Members', '7-10 Members', '10+ Members']
    },
    {
      field: 'pastClients',
      label: 'Past Clients',
      type: 'text'
    },
    {
      field: 'budgetRange',
      label: 'Budget Range',
      type: 'dropdown',
      options: ['< ₹50K', '₹50K - ₹1L', '₹1L - ₹5L', '₹5L+']
    },
    {
      field: 'communicationTools',
      label: 'Communication Tools',
      type: 'dropdown',
      options: ['Slack', 'WhatsApp', 'Email', 'Microsoft Teams']
    },
    {
      field: 'salesHelpRequired',
      label: 'Sales Help Required',
      type: 'dropdown',
      options: ['Yes', 'No']
    }
  ];

navigateToReview() {
  if (this.form.valid) {
    const formData = this.form.getRawValue(); // ✅ Includes disabled fields

    this.Overalldata = {
      plan: this.plan,
      ...formData.step0,
      ...formData.step1,
      ...formData.step2,
      amount: this.amtToPaid ? this.amtToPaid : this.selectedPlanDetails?.price,
      noOfProj: this.noOfProj ? this.noOfProj : this.selectedPlanDetails?.noOfLeads,
      paymentFrequency: this.payFrequency,
      discount: this.yearlyDiscount ? this.yearlyDiscount : this.selectedPlanDetails?.yearlyDiscount
    };

    console.log('Form Data:', this.Overalldata);
    sessionStorage.setItem('overallData', JSON.stringify(this.Overalldata));
    this.router.navigate(['/review']);
  } else {
    this.form.markAllAsTouched();
  }
}


  onSubmit() {

  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.form.get('step1')?.get('resume')?.setValue(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.currentStepGroup.get(field);
    return !!(control && control.invalid && control.touched);
  }
  otherValues: { [key: string]: boolean } = {};

  onDropdownChange(field: string) {
    const value = this.currentStepGroup.get(field)?.value;
    this.otherValues[field] = value === 'Other';

    if (value !== 'Other') {
      // Reset the field to its selected value (in case user changed from Other to something else)
      this.currentStepGroup.get(field)?.setValue(value);
    } else {
      // Clear the control so user can type
      this.currentStepGroup.get(field)?.setValue('');
    }
  }
  onOtherValueBlur(field: string) {
    const val = this.currentStepGroup.get(field)?.value?.trim();
    if (!val) {
      // If input left blank after choosing "Other", reset dropdown
      this.currentStepGroup.get(field)?.setValue('');
      this.otherValues[field] = false;
    }
  }
  ngOnDestroy() {
    if (sessionStorage.getItem('forEdit'))
      sessionStorage.removeItem('forEdit')
  }
}
