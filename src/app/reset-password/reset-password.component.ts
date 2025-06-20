import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpWrapperService } from '../services/api-service.service';
import { Api } from '../services/api-enums';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  resetForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  errorMsg = '';
  successText = '';
  dangerText = '';
  showToast = false;
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private ApiService: HttpWrapperService
  ) { }

  ngOnInit() {
    // 1. Get token from route
    this.route.params.subscribe(params => {
      this.token = params['token'];
    });

    // 2. Initialize form
    this.buildForm();
  }

  buildForm() {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  submitReset() {
    if (this.resetForm.invalid) {
      this.errorMsg = 'Please fill all fields correctly';
      return;
    }

    const { newPassword, confirmPassword } = this.resetForm.value;

    if (newPassword !== confirmPassword) {
      this.errorMsg = 'Passwords do not match';
      return;
    }

    // 3. Use `this.token` in your API call
   
    const payload = {
      token: this.token,
      password: newPassword
    };
    this.ApiService.post(Api.changePassword, payload).subscribe((res:any) => {
      if(res?.status==200){
        this.successText=res?.message;
         this.showSuccessToast();
         this.router.navigate(['/login'])
      }
      if(res?.status==201){
        this.dangerText=res?.message;
         this.showSuccessToast()
      }
     
    })

  }


  showSuccessToast() {
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 9000);
  }
  routeToLogin() {
    this.router.navigate(['/login']);
  }
}
