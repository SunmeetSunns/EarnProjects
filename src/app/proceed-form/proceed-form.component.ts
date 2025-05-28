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
  plan: 'student' | 'professional' | 'agency' = 'agency';

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.initializeForm();
    this.applyPlanBasedValidators(this.plan);
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
        agencyName: ['',Validators.required],
        website: ['',Validators.required],
        location: ['',Validators.required],
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

        // Agency
        teamSize: [''],
        pocName: [''],
        pocEmail: [''],
        pocPhoneNumber: [''],
        coreServices: [''],
        resume: [''], // add resume control for file upload
      }),
      step2: this.fb.group({
        // Student
        availability: [''],
        preferredLearningAreas: [''],
        languageComfort: [''],

        // Professional
        preferredProjectType: [''],
        upiBankInfo: [''],

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

    // similarly apply validators for step1 and step2 fields for student plan

  } else if (plan === 'professional') {
    step0.get('fullName')?.setValidators([Validators.required]);
    step0.get('email')?.setValidators([Validators.required, Validators.email]);
    step0.get('phoneNumber')?.setValidators([
      Validators.required,
      Validators.pattern(/^[0-9]{10}$/),
    ]);
    step0.get('city')?.setValidators([Validators.required]);

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

  navigateToReview() {
    this.router.navigate(['/review']);
  }

  onSubmit() {
    if (this.form.valid) {
      const data = {
        plan: this.plan,
        ...this.form.value.step0,
        ...this.form.value.step1,
        ...this.form.value.step2,
      };
      console.log('Form Data:', data);
      // Do further submit logic here
    } else {
      this.form.markAllAsTouched();
    }
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
}
