import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  errorMsg: String = '';
ngOnInit(): void {
  this.buildForm();
}
constructor(  private formBuilder: FormBuilder,public router:Router){

}
  buildForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      password: ['', [Validators.required,  Validators.minLength(8)]],
    });
  }

  routeToSignUp(): void {
   
    this.router.navigate([`/signup`]);
  }
  changeState(){
    
  }
}
