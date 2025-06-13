import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
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
  maxDate: string = '';
  // You can dynamically set this.plan via Input() or another way as needed
  plan: 'student' | 'professional' | 'agency';
  selectedPlanDetails: any;
  amtToPaid: any;
  Overalldata: any;
  noOfProj: number;
  yearlyDiscount: number;
  payFrequency: string = 'Monthly';
  countryCodes = [
  { code: '+91', iso: 'IN', name: 'India', flag: '🇮🇳' },
  { code: '+1', iso: 'US', name: 'USA', flag: '🇺🇸' },
  { code: '+44', iso: 'GB', name: 'UK', flag: '🇬🇧' },
  { code: '+49', iso: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: '+84', iso: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: '+971', iso: 'AE', name: 'UAE (Dubai)', flag: '🇦🇪' },
  { code: '+27', iso: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: '+33', iso: 'FR', name: 'France', flag: '🇫🇷' },
  { code: '+61', iso: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: '+81', iso: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: '+86', iso: 'CN', name: 'China', flag: '🇨🇳' },
];

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18); // 18 years ago
    this.maxDate = today.toISOString().split('T')[0]; // yyyy-mm-dd format
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

    // Find matching country object from ISO code
    const matchedCountry = this.countryCodes.find(
      (country) => country.iso === data.country_code
    );

    const selectedCode = matchedCountry?.code || '+91';

    this.form.patchValue({
      step0: {
        fullName: data.name || '',
        email: data.email || '',
        phoneNumber: data.mobile || '',
        country_code: selectedCode
      },
      step1: {
        pocName: data.name || '',
        pocEmail: data.email || '',
        pocPhoneNumber: data.mobile || '',
        country_code: selectedCode
      },
    });

    this.form.get('step0.email')?.disable();
    this.form.get('step1.pocEmail')?.disable();
    this.form.get('step0.country_code')?.disable();
    this.form.get('step1.country_code')?.disable();
  }
}

setOtherFieldIfNeeded(fieldName: string, value: string) {
  const options = this.getFieldOptions(fieldName);
  const isOther = value && !options.includes(value);
  this.otherValues[fieldName] = isOther;
  this.form.get(`step1.${fieldName}`)?.setValue(value);
  this.form.get(`step2.${fieldName}`)?.setValue(value); // in case field belongs to step2
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
      projectDescriptions: data.projectDescriptions || '',
      resume: data.resume || '',
      teamSize: data.teamSize || '',
      coreServices: data.coreServices || '',
      pocName: data.pocName || '',
      pocEmail: data.pocEmail || '',
      pocPhoneNumber: data.pocPhoneNumber || ''
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

  // 👇 Set "Other" conditions
  this.setOtherFieldIfNeeded('course', data.course);
  this.setOtherFieldIfNeeded('yearOfStudy', data.yearOfStudy);
  this.setOtherFieldIfNeeded('availability', data.availability);
  this.setOtherFieldIfNeeded('preferredLearningAreas', data.preferredLearningAreas);
  this.setOtherFieldIfNeeded('languageComfort', data.languageComfort);
  this.setOtherFieldIfNeeded('preferredProjectType', data.preferredProjectType);
  this.setOtherFieldIfNeeded('teamSize', data.teamSize);
  this.setOtherFieldIfNeeded('coreServices', data.coreServices);
  this.setOtherFieldIfNeeded('teamCapacity', data.teamCapacity);
  this.setOtherFieldIfNeeded('budgetRange', data.budgetRange);
  this.setOtherFieldIfNeeded('communicationTools', data.communicationTools);
  this.setOtherFieldIfNeeded('salesHelpRequired', data.salesHelpRequired);

  this.form.get('step0.email')?.disable();
  this.form.get('step1.pocEmail')?.disable();

  this.payFrequency = data?.paymentFrequency;
  this.amtToPaid = data?.amount;
  this.noOfProj = data?.noOfProj;
  this.yearlyDiscount = data?.discount;
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
      fullName: ['', [Validators.required, this.noOnlySpacesValidator()]],
      email: ['', [Validators.required, Validators.email, this.noOnlySpacesValidator()]],
      country_code: ['+91'],
      phoneNumber: ['', [
        Validators.required,this.noOnlySpacesValidator()
      ]],
      city: ['', [Validators.required, this.noOnlySpacesValidator()]],
      dob: ['', [Validators.required, this.minAgeValidator(18)]],
      agencyName: ['', [Validators.required, this.noOnlySpacesValidator()]],
      website: ['', [Validators.required, this.noOnlySpacesValidator()]],
      location: ['', [Validators.required, this.noOnlySpacesValidator()]],
    }),
    step1: this.fb.group({
      college: ['', this.noOnlySpacesValidator()],
      course: ['', this.noOnlySpacesValidator()],
      yearOfStudy: ['', this.noOnlySpacesValidator()],
      techStack: ['', this.noOnlySpacesValidator()],
      portfolioLink: ['', this.noOnlySpacesValidator()],
      githubProfile: ['', this.noOnlySpacesValidator()],
      linkedinProfile: ['', this.noOnlySpacesValidator()],
      yearsOfExperience: ['', this.noOnlySpacesValidator()],
      projectDescriptions: ['', this.noOnlySpacesValidator()],
      resume: [''], // file
      teamSize: ['', this.noOnlySpacesValidator()],
      pocName: ['', this.noOnlySpacesValidator()],
      pocEmail: ['', [Validators.email, this.noOnlySpacesValidator()]],
      pocPhoneNumber: ['', this.noOnlySpacesValidator()],
      country_code: ['+91'],
      coreServices: ['', this.noOnlySpacesValidator()],
    }),
    step2: this.fb.group({
      availability: ['', this.noOnlySpacesValidator()],
      preferredLearningAreas: ['', this.noOnlySpacesValidator()],
      languageComfort: ['', this.noOnlySpacesValidator()],
      preferredProjectType: ['', this.noOnlySpacesValidator()],
      teamCapacity: ['', this.noOnlySpacesValidator()],
      pastClients: ['', this.noOnlySpacesValidator()],
      budgetRange: ['', this.noOnlySpacesValidator()],
      communicationTools: ['', this.noOnlySpacesValidator()],
      salesHelpRequired: ['false'],
    }),
  });
}
noOnlySpacesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespaceOnly = typeof control.value === 'string' && control.value.trim().length === 0;
    return isWhitespaceOnly ? { whitespace: true } : null;
  };
}


  validateAge() {
    this.form.get('dob')?.updateValueAndValidity();
  }

  minAgeValidator(minAge: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const dob = new Date(control.value);
      const today = new Date();

      const age = today.getFullYear() - dob.getFullYear();
      const month = today.getMonth() - dob.getMonth();
      const day = today.getDate() - dob.getDate();

      const isUnderAge =
        age < minAge || (age === minAge && (month < 0 || (month === 0 && day < 0)));

      return isUnderAge ? { underage: true } : null;
    };
  }
applyPlanBasedValidators(plan: string) {
  const step0 = this.form.get('step0') as FormGroup;
  const step1 = this.form.get('step1') as FormGroup;
  const step2 = this.form.get('step2') as FormGroup;

  const spaceValidator = this.noOnlySpacesValidator();

  const setValidators = (group: FormGroup, fields: string[], validators: any[]) => {
    fields.forEach((field) => {
      group.get(field)?.setValidators(validators);
      group.get(field)?.updateValueAndValidity();
    });
  };

  // Clear all validators first
  [step0, step1, step2].forEach(group => {
    Object.keys(group.controls).forEach(key => {
      group.get(key)?.clearValidators();
      group.get(key)?.updateValueAndValidity();
    });
  });

  if (plan === 'student') {
    setValidators(step0, ['fullName', 'city'], [Validators.required, spaceValidator]);
    setValidators(step0, ['email'], [Validators.required, Validators.email, spaceValidator]);
    setValidators(step0, ['phoneNumber'], [Validators.required,Validators.pattern(/^(?!0{10})[6-9][0-9]{9}$/)]);
    setValidators(step0, ['dob'], [Validators.required, this.minAgeValidator(18)]);

    setValidators(step1, ['college', 'course', 'yearOfStudy', 'techStack'], [Validators.required, spaceValidator]);

    setValidators(step2, ['availability', 'languageComfort', 'preferredLearningAreas'], [Validators.required, spaceValidator]);

  } else if (plan === 'professional') {
    setValidators(step0, ['fullName', 'city'], [Validators.required, spaceValidator]);
    setValidators(step0, ['email'], [Validators.required, Validators.email, spaceValidator]);
    setValidators(step0, ['phoneNumber'], [Validators.required,Validators.pattern(/^(?!0{10})[6-9][0-9]{9}$/)]);
    setValidators(step0, ['dob'], [Validators.required, this.minAgeValidator(18)]);

    setValidators(step1, ['yearsOfExperience', 'projectDescriptions', 'techStack'], [Validators.required, spaceValidator]);

    setValidators(step2, ['availability', 'languageComfort', 'preferredProjectType'], [Validators.required, spaceValidator]);

  } else if (plan === 'agency') {
    setValidators(step0, ['agencyName'], [Validators.required, spaceValidator]);
    // website and location are optional — no validators set

    setValidators(step1, ['teamSize', 'pocName', 'pocPhoneNumber', 'techStack', 'coreServices'], [Validators.required, spaceValidator]);
    setValidators(step1, ['pocEmail'], [Validators.required, Validators.email, spaceValidator]);

    setValidators(step2, ['teamCapacity', 'pastClients', 'budgetRange', 'communicationTools', 'salesHelpRequired'], [Validators.required, spaceValidator]);
  }

  // Final validation update
  [step0, step1, step2].forEach(group => {
    Object.keys(group.controls).forEach(key => {
      group.get(key)?.updateValueAndValidity();
    });
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
otherValues: any = {};

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
    // { field: 'pocPhoneNumber', label: 'POC Phone Number', type: 'text' },
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
getFieldOptions(fieldName: string): string[] {
  const allDropdowns = [
    ...this.studentFields,
    ...this.agencyFields,
    ...this.studentFieldsStep2,
    ...this.professionalFieldsStep2,
    ...this.agencyFieldsStep2
  ];
  const field = allDropdowns.find(f => f.field === fieldName && f.type === 'dropdown');
  return field ? field.options : [];
}



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
