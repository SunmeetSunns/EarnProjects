import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Plan } from '../../app/models/plan';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, NgbModalModule, FormsModule],
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css']
})
export class PlansComponent implements OnInit {
  currentCategory = '';
  isloggedIn = false;

  @ViewChild('noAccModal') noAccModal!: TemplateRef<any>;

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
      popular: true
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
      popular: true
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
      popular: true
    }
  ];

  filteredPlans: Plan[] = [];
  preferenceForm!: FormGroup;

  preferenceOptions = [];
  maxPreferences = 3;

  showOtherInput = false;
  otherValue = '';
  maxError = false;
  PrefError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modal: NgbModal,
    private formBuilder: FormBuilder
  ) {}

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

    console.log(this.preferenceForm.value);
    this.modal.dismissAll(); // Only closes when valid
  }
}
