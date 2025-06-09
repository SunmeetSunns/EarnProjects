import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PlansComponent } from './plans/plans.component';
import { SignupComponent } from './signup/signup.component';
import { ProceedFormComponent } from './proceed-form/proceed-form.component';
import { ReviewDetailComponent } from './review-detail/review-detail.component';
import { OfferingsComponent } from './offerings/offerings.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { FaqComponent } from './faq/faq.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },         // ✅ Show full home
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },  // ✅ Header only, no home
  { path: 'plans/:category', component: PlansComponent },
  { path: 'proceed-form', component: ProceedFormComponent }, // ✅ Header only, no home
  { path: 'review', component: ReviewDetailComponent },
  { path: 'offerings', component: OfferingsComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'faq', component: FaqComponent },
  {path:'dashboard',component:DashboardComponent}

];
