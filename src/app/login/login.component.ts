import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpWrapperService } from '../services/api-service.service';
import { Api } from '../services/api-enums';
import { LoginServiceService } from '../services/login-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMsg: String = '';
  authToken: any;
  showPassword: boolean=false;
  ngOnInit(): void {
    this.buildForm();
  }
  constructor(private formBuilder: FormBuilder, public router: Router, private ApiService: HttpWrapperService,public loginService:LoginServiceService) {

  }
  buildForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/), Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  routeToSignUp(): void {

    this.router.navigate([`/signup`]);
  }
  changeState() {
    if (this.loginForm.invalid) {
      return;
    }
    else {
      let body = {
        email: this.loginForm.get('username').value,
        password: this.loginForm.get('password').value,
      }
      this.ApiService.post(Api.login, body).subscribe((res: any) => {
        if (res?.token) {
          this.authToken = res?.token;
          sessionStorage.setItem('isLoggedIn', 'true');
          sessionStorage.setItem('authToken', this.authToken);
          sessionStorage.setItem('user', JSON.stringify(res?.user));
          sessionStorage.setItem('havePreference',res?.user?.havePreference.toString())
           this.loginService.setLoginStatus(true);
          const user=res?.user
          this.router.navigate([`/plans/${user?.category}`]);
        }
      })
    }
  }
  togglePassword() {
  this.showPassword = !this.showPassword;
}
}
