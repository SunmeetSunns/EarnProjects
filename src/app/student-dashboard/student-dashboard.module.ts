import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentDashboardRoutingModule } from './student-dashboard-routing.module';
import { DashboardComponent } from '../dashboard/dashboard.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StudentDashboardRoutingModule,
    DashboardComponent
  ]
})
export class StudentDashboardModule { }
