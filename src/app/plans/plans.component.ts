import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Plan } from '../../app/models/plan';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

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

allPlans: Plan[] = [
  {
    name: 'Starter Plan',
    price: '299/month',
    yearlyDiscount: 'Save ₹989.00 annually',
    category: 'student',
    description: 'Small project leads, good for learning and confidence building.',
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
    name: 'Basic Plan',
    price: '499/month',
    yearlyDiscount: 'Save ₹1989.00 annually',
    category: 'student',
    description: 'Real-world tasks with earning potential. Kickstart your career',
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
    name: 'Advanced Plan',
    price: '799/month',
    yearlyDiscount: 'Save ₹2989.00 annually',
    category: 'student',
    description: 'More frequent project leads. Build your portfolio faster.',
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
    name: 'Pro Plan',
    price: '1,299/month',
    yearlyDiscount: 'Save ₹4989.00 annually',
    category: 'student',
    description: 'Premium projects + experience letters on completion + support to close clients',
    features: [
      'Unlimited project leads',
      'Team management tools',
      'Dedicated support',
      'Invoice & billing system',
      'Custom branding',
      'Agency analytics dashboard',
    ],
    popular: true
  },
  {
    name: 'Basic Plan',
    price: '999/month',
    yearlyDiscount: 'Save ₹1,189.00 annually',
    category: 'professional',
    description: 'Projects matching your experience level.',
    features: [
      'Access to entry-level project leads',
      'Email support',
      'Profile visibility to clients',
      'Basic project filtering',
    ],
    popular: false
  },
  {
    name: 'Silver Plan',
    price: '4,999/month',
    yearlyDiscount: 'Save ₹2,389.00 annually',
    category: 'professional',
    description: 'Mid-level project leads, better payouts.',
    features: [
      'Access to mid-level project leads',
      'Better project payout opportunities',
      'Priority email support',
      'Project performance tracking',
      'Resume builder tools',
    ],
    popular: true
  },
  {
    name: 'Gold Plan',
    price: '9,999/month',
    yearlyDiscount: 'Save ₹4,989.00 annually',
    category: 'professional',
    description: 'Premium clients, occasional team collaboration opportunities.',
    features: [
      'Leads from premium clients',
      'Occasional team collaboration projects',
      'Profile badge for top professionals',
      'Direct client messaging',
      'Networking opportunities',
      'Advanced project analytics',
    ],
    popular: false
  },
  {
    name: 'Pro Plan',
    price: '19,999/month',
    yearlyDiscount: 'Save ₹9,989.00 annually',
    category: 'professional',
    description: 'Scale your freelancing: Skill programs, lead support, personal branding help.',
    features: [
      'All-access project leads',
      'Personal branding assistance',
      'Skill development programs',
      'Dedicated success manager',
      'Lead prioritization support',
      'Freelancer toolkit and templates',
    ],
    popular: true
  },
  {
    name: 'Basic Trust Plan',
    price: '9,999/month',
    yearlyDiscount: 'Save ₹11,989.00 annually',
    category: 'agency',
    description: 'Get consistent leads to keep your team busy.',
    features: [
      'Consistent project leads for your agency',
      'Team account access',
      'Email support',
      'Basic agency dashboard',
      'Client communication tools',
    ],
    popular: false
  },
  {
    name: 'Silver Plan',
    price: '19,999/month',
    yearlyDiscount: 'Save ₹23,989.00 annually',
    category: 'agency',
    description: 'Leads + occasional sales support.',
    features: [
      'All Basic features',
      'Increased lead volume',
      'Occasional sales pitch support',
      'Agency performance reports',
      'Access to verified clients',
    ],
    popular: false
  },
  {
    name: 'Gold Plan',
    price: '49,999/month',
    yearlyDiscount: 'Save ₹59,989.00 annually',
    category: 'agency',
    description: 'High-ticket client leads. Grow revenue.',
    features: [
      'High-ticket client leads',
      'Advanced filtering for large projects',
      'Project negotiation support',
      'Dedicated account manager',
      'Client rating & review insights',
    ],
    popular: true
  },
  {
    name: 'Premium Member Plan',
    price: '99,999/month',
    yearlyDiscount: 'Save ₹1,19,989.00 annually',
    category: 'agency',
    description: 'Exclusive, high-value leads + full support to manage and close clients.',
    features: [
      'Exclusive access to premium leads',
      'Full client closing support',
      'Advanced CRM tools',
      'Agency branding & marketing help',
      'Client contract management',
      'Dedicated growth advisor',
    ],
    popular: true
  }
];


  filteredPlans: Plan[] = [];
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modal: NgbModal,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const category = params['category'];
      this.currentCategory = category;
      this.filteredPlans = category === 'all'
        ? this.allPlans
        : this.allPlans.filter(plan => plan.category === category);
    });

    const loggedInRaw = sessionStorage.getItem('isLoggedIn');
    if (loggedInRaw) {
      const loggedValue = JSON.parse(loggedInRaw);
      this.isloggedIn = loggedValue;

      if (this.isloggedIn) {
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
    this.buildForms();
    if (this.currentCategory === 'student') {
      this.preferenceOptions = ['Mobile App Development', 'X', 'Y', 'Development', 'Testing', 'Marketing', 'SEO', 'AI', 'Graphic Designing', 'Digital Marketing', 'Others'];
    } else if (this.currentCategory === 'professional') {
      this.preferenceOptions = ['Mobile App Development', 'Web Development', 'Testing', 'Marketing', 'SEO', 'AI', 'Others'];
    } else if (this.currentCategory === 'agency') {
      this.preferenceOptions = ['Mobile App Development', 'Z', 'Development', 'Testing', 'Marketing', 'SEO', 'AI', 'Others'];
    }
  }

  routeToSignup(category: string) {
    this.currentCategory = category;
    sessionStorage.setItem('categoryName', category);
    this.router.navigate(['/signup']);
  }

  savePreferrence() {
    if (this.selected.length === 0) {
      this.PrefError = 'Please select at least one preference.';
      return;
    }
    if (this.currentCategory == 'student') {

      setTimeout(() => {
        this.modal.open(this.studentForm, {
          size: 'md',
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
  buildForms() {
    if (this.currentCategory == 'student') {
      this.studentFormArea = this.formBuilder.group({
        collegeName: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
        document: [null]
      });
    }
    if (this.currentCategory == 'professional') {
      this.professionalFormArea = this.formBuilder.group({
        currentEmployer: ['', Validators.required],
        designation: ['', Validators.required],
        workEmail: ['', [Validators.required, Validators.email]],
        employmentType: ['', Validators.required],
        experience: ['', [Validators.required, Validators.min(0)]],
        proofDocument: [null, Validators.required],
        linkedin: [''],
      });

    }
    if (this.currentCategory == 'agency') {
      this.agencyFormArea = this.formBuilder.group({
        linkedIn: [''],
        domain: ['', Validators.required],
        services: [[], Validators.required],
        fullAddress: ['', Validators.required],
        state: ['', Validators.required],
        pinCode: ['', [Validators.required, Validators.pattern(/^[0-9]{4,6}$/)]],
        employees: ['', Validators.required]
      })
    }
  }
  onSubmitAgency(): void {
    if (this.agencyFormArea.valid) {
      console.log('Agency Verification Data:', this.agencyFormArea.value);
      this.modal.dismissAll();
      // handle modal close logic here
    } else {
      this.agencyFormArea.markAllAsTouched();
    }
  }

  onProfessionalFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.professionalFormArea.patchValue({ proofDocument: file });
    }
  }
  onSubmitProfessional() {
    if (this.professionalFormArea.valid) {
      const formData = new FormData();
      formData.append('currentEmployer', this.professionalFormArea.value.currentEmployer);
      formData.append('designation', this.professionalFormArea.value.designation);
      formData.append('workEmail', this.professionalFormArea.value.workEmail);
      formData.append('employmentType', this.professionalFormArea.value.employmentType);
      formData.append('experience', this.professionalFormArea.value.experience);
      formData.append('proofDocument', this.professionalFormArea.value.proofDocument);
      formData.append('linkedin', this.professionalFormArea.value.linkedin);

      console.log('Professional Form Submitted:', formData);
      this.modal.dismissAll(); // Submit to backend here
    } else {
      console.log('Professional form invalid');
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.studentFormArea.patchValue({ document: file });
    }
  }

  onSubmit() {
    if (this.studentFormArea.valid) {
      console.log(this.studentFormArea.value)
      const formData = new FormData();
      formData.append('collegeName', this.studentFormArea.value.collegeName);
      formData.append('city', this.studentFormArea.value.city);
      formData.append('state', this.studentFormArea.value.state);
      formData.append('pincode', this.studentFormArea.value.pincode);
      formData.append('document', this.selectedFile as Blob);

      // TODO: Submit to backend
      console.log('Student Form Submitted:', formData);
      this.modal.dismissAll();
    } else {
      console.log('Form is invalid');
    }
  }
  ngOnDestroy() {
    if (sessionStorage.getItem('isLoggedIn')) {
      sessionStorage.removeItem('isLoggedIn');
      this.isloggedIn = false;
    }


  }
}
