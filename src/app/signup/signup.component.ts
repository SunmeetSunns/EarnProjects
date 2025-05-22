import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BrowserCheckService } from '../services/browser-check.service'; // ✅ Import service

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  signForm!: FormGroup;
  errorMsg: string = '';
  selectedCategory: string = '';
  signUp: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private browserCheck: BrowserCheckService // ✅ Inject service
  ) {}

  ngOnInit(): void {
    this.buildForm();

    if (this.browserCheck.isBrowser()) {
      const categoryFromSession = sessionStorage.getItem('categoryName');
      if (categoryFromSession) {
        this.selectedCategory = categoryFromSession;
        this.signForm.get('category')?.setValue(categoryFromSession);
      }
    }
  }

  buildForm(): void {
    this.signForm = this.formBuilder.group({
      username: ['', Validators.required],
      phn_no: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      category: ['', Validators.required]
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.signForm.get('category')?.setValue(category);
  }

  routeToSignUp(): void {
    this.router.navigate(['/login']);
  }

  changeState(): void {
    if (this.signForm.invalid) {
      this.signForm.markAllAsTouched();
      return;
    }
    console.log(this.signForm.value);
    sessionStorage.setItem('isLoggedIn','true')
    this.router.navigate([`/plans/${this.selectedCategory}`]);
  }

  ngOnDestroy(): void {
    if (this.browserCheck.isBrowser()) {
      sessionStorage.removeItem('categoryName');
    }
  }
}
