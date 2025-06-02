import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BrowserCheckService } from '../services/browser-check.service'; // ✅ Import service
import { HttpWrapperService } from '../services/api-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Api } from '../services/api-enums';



@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  signForm!: FormGroup;
  errorMsg: string = '';
  selectedCategory: string = '';
  signUp: boolean;
  otp: any;
  otpVerified: boolean = false;
  successText: string = '';
  dangerText: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private browserCheck: BrowserCheckService,
    private modal: NgbModal,
    private Apiservice: HttpWrapperService// ✅ Inject service
  ) { }

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
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]
      ],
      phn_no: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[6-9][0-9]{9}$')]],
      category: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      confirm_password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.signForm.get('category')?.setValue(category);
  }
  showPassword = false;
  showConfirmPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  routeToSignUp(action?: any): void {

    if (this.signForm.invalid && !action) {
      this.signForm.markAllAsTouched();
      return;
    }
    if (action) {
      this.router.navigate(['/login']);

    }
    if (this.otpVerified) {
      let body = {
        email: this.signForm.get('mail').value,
        password: this.signForm.get('password').value,
        confirmPassword: this.signForm.get('confirm_password').value,
        name: this.signForm.get('username').value,
        category: this.signForm.get('category').value,
        mobile: this.signForm.get('phn_no').value
      }
      this.Apiservice.post(Api.signup, body).subscribe((res) => {
        if (res) {

          this.router.navigate(['/login']);
        }
      })
    }


  }

  // changeState(): void {
  //   if (this.signForm.invalid) {
  //     this.signForm.markAllAsTouched();
  //     return;
  //   }
  //   console.log(this.signForm.value);

  // }

  ngOnDestroy(): void {
    if (this.browserCheck.isBrowser()) {
      sessionStorage.removeItem('categoryName');
    }
  }

  closeOtpModal() {
    this.modal.dismissAll()
  }
  sendOtp(modalName: any) {
    this.dangerText = ''
    this.successText = ''
    let body = {
      email: this.signForm.get('mail').value
    }
    this.Apiservice.post(Api.sendOtp, body).subscribe((res: any) => {
      if (res) {
        if (res?.Status == 200) {
          this.successText = res?.message;
          this.modal.open(modalName, { size: 'md', keyboard: false, backdrop: 'static' })
        }
        if (res?.Status == 201) {
          this.dangerText = res?.message
        }
        this.showSuccessToast();

      }
    })
  }
  verifyOtp() {
    this.successText = ''
    this.dangerText = '';
    let body = {
      email: this.signForm.get('mail').value,
      otp: this.otp
    }
    this.Apiservice.post(Api.verifyOtp, body).subscribe((res: any) => {
      if (res) {
        if (res?.status == 200) {
          this.successText = res?.message;
          this.modal.dismissAll();
          this.otpVerified = true;
          this.showSuccessToast();
           
          this.signForm.get('mail').disable();
        }
        if (res?.status == 201) {
          this.dangerText = res?.message;
          this.showSuccessToast()
        }

       
      }
    })

  }
  showToast = false;

  showSuccessToast() {
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 9000);
  }
}
