import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PlansComponent } from './plans/plans.component';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },         // ✅ Show full home
  { path: 'login', component: LoginComponent },  
  {path:'signup',component:SignupComponent},  // ✅ Header only, no home
 { path: 'plans/:category', component: PlansComponent }    // ✅ Header only, no home
];
