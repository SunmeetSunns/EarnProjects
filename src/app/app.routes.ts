import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PlansComponent } from './plans/plans.component';
import { SignupComponent } from './signup/signup.component';
import { ProceedFormComponent } from './proceed-form/proceed-form.component';
import { ReviewDetailComponent } from './review-detail/review-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },         // ✅ Show full home
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },  // ✅ Header only, no home
  { path: 'plans/:category', component: PlansComponent },
  { path: 'proceed-form', component: ProceedFormComponent }, // ✅ Header only, no home
  { path: 'review', component: ReviewDetailComponent }
];
