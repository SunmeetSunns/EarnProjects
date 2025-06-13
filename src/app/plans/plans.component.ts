import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Plan } from '../../app/models/plan';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpWrapperService } from '../services/api-service.service';
import { Api } from '../services/api-enums';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, NgbModalModule, FormsModule, ReactiveFormsModule],
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css']
})
export class PlansComponent implements OnInit {
  currentCategory = '';
  isloggedIn = false;
  employeeOptions: string[] = ['1-10', '11-50', '51-200', '201-500', '500+'];
  servicesList: string[] = ['Web Development', 'Mobile Apps', 'AI/ML', 'Blockchain', 'Marketing'];
  @ViewChild('noAccModal') noAccModal!: TemplateRef<any>;
  @ViewChild('studentForm') studentForm!: TemplateRef<any>;
  @ViewChild('professionalForm') professionalForm!: TemplateRef<any>;
  @ViewChild('agencyForm') agencyForm!: TemplateRef<any>;

  allPlans: any = [



  ];


  filteredPlans: any = [];
  preferenceForm!: FormGroup;
  studentFormArea!: FormGroup;
  professionalFormArea!: FormGroup;
  agencyFormArea!: FormGroup;
  preferenceOptions = [];
  maxPreferences = 3;

  showOtherInput = false;
  otherValue = '';
  maxError = false;
  PrefError = '';
  selectedFile: Blob;
  category: any;
  clientSetupDone: boolean = false;
  loggerCategory: any;
  showLoggerError: boolean = false;
  planPurchased: boolean;
  purchasedMsg: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modal: NgbModal,
    private formBuilder: FormBuilder,
    private ApiService: HttpWrapperService
  ) { }

  ngOnInit(): void {
    this.showLoggerError = false
    this.route.params.subscribe(params => {
      this.category = params['category'];
      this.populatePlanData();
      this.currentCategory = this.category;
      if (sessionStorage.getItem('havePreference')) {
        const setUpDone = JSON.parse(sessionStorage.getItem('havePreference'))
        this.clientSetupDone = setUpDone;
      }
      if (sessionStorage.getItem('user')) {
        const loggerCategory = JSON.parse(sessionStorage.getItem('user'))
        this.loggerCategory = loggerCategory.category
      }
      if (sessionStorage.getItem('planPurchased')) {
        const data=JSON.parse(sessionStorage.getItem('planPurchased'))
        this.planPurchased = data
      }

    });

    const loggedInRaw = sessionStorage.getItem('isLoggedIn');
    if (loggedInRaw) {
      const loggedValue = JSON.parse(loggedInRaw);
      this.isloggedIn = loggedValue;

      if (this.isloggedIn && !this.clientSetupDone) {
        setTimeout(() => {
          this.modal.open(this.noAccModal, {
            size: 'md',
            centered: true,
            backdrop: 'static', // prevent click outside
            keyboard: false     // prevent ESC close
          });
        });

        this.buildPreferenceForm();
        this.categoryWisePreferrence();
      }
    }
  }
  populatePlanData() {
    this.showLoggerError = false;
    let body = {
      category: this.category
    }
    this.ApiService.post(Api.getCategorylans, body).subscribe((res: any) => {
      if (res?.Status == 200) {

        this.populatePlanArray(res?.plans)
      }
    })
  }
 populatePlanArray(plans: any) {
  this.allPlans = [];
  for (let i = 0; i < plans.length; i++) {
    this.allPlans.push({
      name: plans[i].planName,
      price: plans[i].price,
      yearlyDiscount: plans[i].discount,
      category: plans[i].category,
      description: plans[i].planDescription,
      features: plans[i].features,
      popular: plans[i].popular,
      noOfLeads: plans[i].noOfLeads,
      discountPer: this.calculateDiscount(plans[i].price, plans[i].discount),
      currency:plans[i]?.currency
    });

    this.filteredPlans.push({
      discountPer: this.calculateDiscount(plans[i].price, plans[i].discount),
    })
  }

  // ✅ Sort only if 'all' category is selected
  if (this.category === 'all' && this.loggerCategory) {
    this.allPlans = [
      ...this.allPlans.filter(plan => plan.category === this.loggerCategory),
      ...this.allPlans.filter(plan => plan.category !== this.loggerCategory)
    ];
  }

  // Agar specific category selected hai to filter bhi yahan kar sakta hai
  if (this.category !== 'all') {
    this.filteredPlans = this.allPlans.filter(plan => plan.category === this.category);
  } else {
    this.filteredPlans = this.allPlans;
  }
}

  calculateDiscount(oPrice: any, discount: any) {
    const discountPercentage = Math.round((Number(discount) - Number(oPrice)) / Number(discount) * 100);
    return discountPercentage.toFixed(2);


  }
  buildPreferenceForm() {
    this.preferenceForm = this.formBuilder.group({
      selected: this.formBuilder.array([])
    });
  }

  get selected(): FormArray {
    return this.preferenceForm.get('selected') as FormArray;
  }

  isSelected(option: string): boolean {
    return this.selected.value.includes(option);
  }

  toggleSelection(option: string) {
    this.PrefError = '';
    if (this.selected.length < 3) this.maxError = false;

    if (option === 'Others') {
      this.showOtherInput = true;
      return;
    }

    const index = this.selected.value.indexOf(option);

    if (index > -1) {
      this.selected.removeAt(index);
    } else {
      if (this.selected.length >= this.maxPreferences) {
        this.maxError = true;
        return;
      }
      this.selected.push(this.formBuilder.control(option));
    }
  }

  addOtherPreference() {
    const trimmedValue = this.otherValue.trim();
    this.maxError = false;

    if (trimmedValue && this.selected.length < this.maxPreferences) {
      this.selected.push(this.formBuilder.control(trimmedValue));
      this.showOtherInput = false;
      this.otherValue = '';
    } else if (this.selected.length >= this.maxPreferences) {
      this.maxError = true;
    }
  }


  categoryWisePreferrence() {
    const skillsList = [
      'Web Development (Frontend / Backend / Full-stack)',
      'Mobile App Development',
      'UI/UX Design',
      'Graphic Design / Branding',
      'SEO / SEM',
      'Social Media Management',
      'Content Writing / Copywriting',
      'Video Editing ',
      'Animation',
      'Chatbox Integration',
      'Digital Marketing',
      'Data Analysis / Power BI / Excel',
      'Virtual Assistant / Admin Support',
      'Python',
      'Java',
      'Others'

    ];

    this.buildForms();

    if (this.currentCategory === 'student') {
      this.preferenceOptions = [...skillsList];
    } else if (this.currentCategory === 'professional') {
      this.preferenceOptions = [...skillsList];
    } else if (this.currentCategory === 'agency') {
      this.preferenceOptions = [...skillsList];
    }
  }

  routeToSignup(category: string, proceed?: any, rawData?: any) {
    this.showLoggerError = false;

    if (this.planPurchased==true) {
      this.purchasedMsg = 'You currently have an active plan. You can upgrade or renew after it expires.'
      return
    }
    if (proceed) {
      if (this.loggerCategory !== category) {
        this.showLoggerError = true;
        return;
      }
      else {
        sessionStorage.setItem('selectedPlan', JSON.stringify(rawData))
        this.router.navigate(['/proceed-form'])
      }

    }
    else {
      this.currentCategory = category;
      sessionStorage.setItem('categoryName', category);
      this.router.navigate(['/signup']);
    }
  }

  savePreferrence() {
    if (this.selected.length === 0) {
      this.PrefError = 'Please select at least one preference.';
      return;
    }
    if (this.currentCategory == 'student') {

      setTimeout(() => {
        this.modal.open(this.studentForm, {
          size: 'lg',
          centered: true,
          backdrop: 'static', // prevent click outside
          keyboard: false     // prevent ESC close
        });
      });

    }
    if (this.currentCategory == 'professional') {
      setTimeout(() => {
        this.modal.open(this.professionalForm, {
          size: 'lg',
          centered: true,
          backdrop: 'static', // prevent click outside
          keyboard: false     // prevent ESC close
        });
      });
    }
    if (this.currentCategory == 'agency') {
      setTimeout(() => {
        this.modal.open(this.agencyForm, {
          size: 'lg',
          centered: true,
          backdrop: 'static', // prevent click outside
          keyboard: false     // prevent ESC close
        });
      });
    }

    // this.modal.dismissAll(); // Only closes when valid
  }
noOnlySpacesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isOnlySpaces = control.value && control.value.trim().length === 0;
    return isOnlySpaces ? { onlySpaces: true } : null;
  };
}

buildForms() {
  if (this.currentCategory == 'student') {
    this.studentFormArea = this.formBuilder.group({
      collegeName: ['', [Validators.required, this.noOnlySpacesValidator()]],
      city: ['', [Validators.required, this.noOnlySpacesValidator()]],
      state: ['', [Validators.required, this.noOnlySpacesValidator()]],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      document: [null, Validators.required]
    });
  }

  if (this.currentCategory == 'professional') {
    this.professionalFormArea = this.formBuilder.group({
      currentEmployer: ['', [Validators.required, this.noOnlySpacesValidator()]],
      designation: ['', [Validators.required, this.noOnlySpacesValidator()]],
      workEmail: ['', [Validators.required, Validators.email]],
      employmentType: ['', [Validators.required, this.noOnlySpacesValidator()]],
      experience: ['', [Validators.required, Validators.min(0)]],
      proofDocument: [null, Validators.required],
      linkedin: [''],
    });
  }

  if (this.currentCategory == 'agency') {
    this.agencyFormArea = this.formBuilder.group({
      linkedIn: [''],
      domain: ['', [Validators.required, this.noOnlySpacesValidator()]],
      services: [[], Validators.required],
      fullAddress: ['', [Validators.required, this.noOnlySpacesValidator()]],
      state: ['', [Validators.required, this.noOnlySpacesValidator()]],
      pinCode: ['', [Validators.required, Validators.pattern(/^[0-9]{4,6}$/)]],
      employees: ['', [Validators.required, this.noOnlySpacesValidator()]]
    });
  }
}


  onProfessionalFileChange(event: any): void {
    const file = event.target.files?.[0];

    if (file) {
      this.professionalFormArea.get('proofDocument')?.setValue(file);
      this.professionalFormArea.get('proofDocument')?.markAsTouched();
    } else {
      this.professionalFormArea.get('proofDocument')?.setValue(null);
    }
  }

  isInvalid(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return control?.invalid && (control?.touched || control?.dirty);
  }


  onFileChange(event: any): void {
    const file = event.target.files?.[0];

    if (file) {
      this.studentFormArea.get('document')?.setValue(file);
      this.studentFormArea.get('document')?.markAsTouched();
    } else {
      this.studentFormArea.get('document')?.setValue(null);
    }
  }

  submitForm() {
    let formData = new FormData();
    let valid = false;

    if (this.currentCategory === 'student') {
      if (this.studentFormArea.valid) {
        const values = this.studentFormArea.value;
        formData.append('collegeName', values.collegeName);
        formData.append('city', values.city);
        formData.append('state', values.state);
        formData.append('pincode', values.pincode);
        formData.append('document', this.selectedFile as Blob);
        valid = true;
      } if (this.studentFormArea.invalid) {
        this.studentFormArea.markAllAsTouched();
        return;
      }

    } else if (this.currentCategory === 'professional') {
      if (this.professionalFormArea.valid) {
        const values = this.professionalFormArea.value;
        formData.append('currentEmployer', values.currentEmployer);
        formData.append('designation', values.designation);
        formData.append('workEmail', values.workEmail);
        formData.append('employmentType', values.employmentType);
        formData.append('experience', values.experience);
        formData.append('proofDocument', values.proofDocument);
        formData.append('linkedin', values.linkedin);
        valid = true;
      } else {
        this.professionalFormArea.markAllAsTouched();
      }

    } else if (this.currentCategory === 'agency') {
      if (this.agencyFormArea.valid) {
        const values = this.agencyFormArea.value;
        formData.append('linkedIn', values.linkedIn);
        formData.append('domain', values.domain);
        formData.append('services', JSON.stringify(values.services));
        formData.append('fullAddress', values.fullAddress);
        formData.append('state', values.state);
        formData.append('pinCode', values.pinCode);
        formData.append('employees', values.employees);
        valid = true;
      } else {
        this.agencyFormArea.markAllAsTouched();
      }
    }

    if (valid) {
      this.setPrefferenceInDB();
      this.modal.dismissAll();
    }
  }

  setPrefferenceInDB() {
    let basic_data
    if (this.category == 'student') {
      basic_data = this.studentFormArea.value;

    }
    if (this.category == 'professional') {
      basic_data = this.professionalFormArea.value;

    }
    if (this.category == 'agency') {
      basic_data = this.agencyFormArea.value;

    }
    let body = {
      prefference: this.preferenceForm.value,
      basic_data: basic_data

    }
    this.ApiService.post(Api.savePrefference, body).subscribe((res: any) => {
      if (res?.Status == 201) {
        this.clientSetupDone = res?.userHavePreference
        sessionStorage.setItem('havePreference', JSON.stringify(this.clientSetupDone))

      }
    })

  }
  ngOnDestroy() {
    // if (sessionStorage.getItem('isLoggedIn')) {
    //   sessionStorage.removeItem('isLoggedIn');
    //   this.isloggedIn = false;
    // }


  }

}
