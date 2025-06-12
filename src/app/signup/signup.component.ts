import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule, ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';
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
  otpVerified: boolean = false;
  successText: string = '';
  dangerText: any;
  otpDigits: string[] = ['', '', '', '', '', ''];
  otpArray = new Array(6).fill(0);
  otpError: string = '';
  shakeOtp = false;
  timer: number = 30;
  timerInterval: any;
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


  noOnlySpacesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespaceOnly = typeof control.value === 'string' && control.value.trim().length === 0;
    return isWhitespaceOnly ? { whitespace: true } : null;
  };
}
buildForm(): void {
  this.signForm = this.formBuilder.group({
    username: ['', [
      Validators.required,
      Validators.pattern('^[a-zA-Z ]+$'),
      this.noOnlySpacesValidator()
    ]],
    phn_no: ['', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^[6-9][0-9]{9}$')
    ]],
    category: ['', [
      Validators.required,
      this.noOnlySpacesValidator()
    ]],
    mail: ['', [
      Validators.required,
      Validators.email,
      this.noOnlySpacesValidator()
    ]],
    password: ['', Validators.compose([
      Validators.required,
      Validators.minLength(8),
      this.passwordStrengthValidator,
      this.noOnlySpacesValidator()
    ])],
    confirm_password: ['', [Validators.required, this.noOnlySpacesValidator()]],
  }, {
    validators: this.confirmPasswordValidator()
  });
}

getPasswordError() {
  const errors = this.signForm.get('password')?.errors;
  if (errors?.['passwordStrength']) {
    return errors['passwordStrength'];
  }
  // If no error, return all true to show all green ticks
  return {
    hasUpperCase: true,
    hasLowerCase: true,
    hasNumeric: true,
    hasSpecial: true,
    isValidLength: true,
  };
}

confirmPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirm_password')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      control.get('confirm_password')?.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      // Remove mismatch error if they match now
      const confirmControl = control.get('confirm_password');
      if (confirmControl?.hasError('mismatch')) {
        confirmControl.setErrors(null);
      }
      return null;
    }
  };
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
    this.dangerText = ''
    this.successText = ''
    if (this.signForm.invalid && !action) {
      this.signForm.markAllAsTouched();
      this.scrollToFirstInvalidControl(); 
      return;
    }
    if (action) {
      this.router.navigate(['/login']);

    }
    if (this.signForm.valid && !action && !this.otpVerified) {
      this.dangerText = 'Please Validate Your Email First';
      this.showSuccessToast();
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

      this.Apiservice.post(Api.signup, body).subscribe((res: any) => {

        if (res?.status == 400 || res?.status == 201) {
          this.dangerText = res?.error ? res?.error : res?.message;

        }
        if (res?.status == 200) {
          this.successText = res?.message
          this.router.navigate(['/login']);
        }
        this.showSuccessToast()
      })
    }


  }
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);  // ✅ updated special char regex
    const isValidLength = value.length >= 8;

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial && isValidLength;

    if (!passwordValid) {
      return {
        passwordStrength: {
          hasUpperCase,
          hasLowerCase,
          hasNumeric,
          hasSpecial,
          isValidLength,
        },
      };
    }

    return null;
  }
scrollToFirstInvalidControl() {
  const formElement = document.querySelector('form');
  const firstInvalidControl = formElement?.querySelector('.ng-invalid');

  if (firstInvalidControl) {
    firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    (firstInvalidControl as HTMLElement).focus();
  }

  // ✅ Handle category separately (outside form)
  const categoryControl = this.signForm.get('category');
  if (categoryControl?.invalid && categoryControl?.touched) {
    const categoryElement = document.getElementById('category');
    if (categoryElement) {
      categoryElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Optional shake animation
      categoryElement.classList.add('shake');
      setTimeout(() => categoryElement.classList.remove('shake'), 500);
    }
  }
}


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
          this.startTimer()
          this.successText = res?.message;
          this.modal.open(modalName, { size: 'lg', keyboard: false, backdrop: 'static' })
          console.log("OTP ARRAY LENGTH:", this.otpArray.length);

        }
        if (res?.Status == 201) {
          this.dangerText = res?.message
        }
        this.showSuccessToast();

      }
    })
  }

  verifyOtp() {
    this.successText = '';
    this.dangerText = '';
    this.otpError = '';

    if (this.otp.length < 6) {
      this.otpError = 'Please enter the complete 6-digit OTP.';
      this.triggerShake();
      return;
    }

    const body = {
      email: this.signForm.get('mail')?.value,
      otp: this.otp // from getter this.otpDigits.join('')
    };

    this.Apiservice.post(Api.verifyOtp, body).subscribe((res: any) => {
      if (res?.status === 200) {
        this.successText = res?.message;
        this.modal.dismissAll();
        this.otpVerified = true;
        this.showSuccessToast();

        this.signForm.get('mail')?.disable();
      } else if (res?.status === 201) {
        this.dangerText = res?.message;
        this.otpError = res?.message;
        this.triggerShake();
        this.showSuccessToast();
      } else {
        this.dangerText = 'Something went wrong.';
        this.otpError = 'Something went wrong.';
        this.triggerShake();
      }
    }, (err) => {
      this.dangerText = 'Server error, please try again.';
      this.otpError = 'Server error, please try again.';
      this.triggerShake();
    });
  }


  showToast = false;

  showSuccessToast() {
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 9000);
  }
  onOtpInput(event: any, index: number) {
    const input = event.target;
    const value = input.value;

    if (value.length === 1 && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      (nextInput as HTMLInputElement)?.focus();
    }

    this.otpDigits[index] = value.charAt(0);
  }

  onOtpKeyDown(event: KeyboardEvent, index: number) {
    const key = event.key;
    if (key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      (prevInput as HTMLInputElement)?.focus();
    }
  }

  get otp(): string {
    return this.otpDigits.join('');
  }
  triggerShake() {
    this.shakeOtp = true;
    setTimeout(() => this.shakeOtp = false, 300);
  }

  startTimer() {
    this.timer = 30;
    this.timerInterval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }
  resendOtp() {
    this.dangerText = '';
    this.successText = '';
    this.otpDigits = ['', '', '', '', '', ''];
    this.otpError = '';
    let body = {
      email: this.signForm.get('mail').value
    };

    this.Apiservice.post(Api.sendOtp, body).subscribe((res: any) => {
      if (res) {
        if (res?.Status == 200) {
          this.startTimer();  // timer fir se reset karna
          this.successText = res?.message;

        }
        else if (res?.Status == 201) {
          this.dangerText = res?.message;
          // agar tu error toast bhi dikhata h to
        }
      }
      this.showSuccessToast();
    }, (error) => {
      this.dangerText = "Something went wrong, please try again.";
      this.showSuccessToast();
    });
  }


}
