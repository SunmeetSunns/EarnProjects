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
    if (this.signForm.valid && !action && !this.otpVerified) {
      this.dangerText = 'Please Validate OTP first';
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
