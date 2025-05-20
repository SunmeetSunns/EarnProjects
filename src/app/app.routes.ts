import { Routes } from '@angular/router';
import { PlansComponent } from './plans/plans.component';

export const routes: Routes = [

  { path: 'plans/:category', component: PlansComponent }
];
