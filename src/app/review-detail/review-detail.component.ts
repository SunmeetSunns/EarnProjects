import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from '../services/payment.service';
import { HttpWrapperService } from '../services/api-service.service';
import { Api } from '../services/api-enums';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var Razorpay: any;
@Component({
  selector: 'app-review-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-detail.component.html',
  styleUrl: './review-detail.component.css'
})
export class ReviewDetailComponent implements OnInit {
  Razorpay: any;
  planDetails: any;
  fieldData: any;
  agencyFields: { field: string; value: any; }[];
  professionalFieldsStep2: { field: string; value: any; }[];
  agencyFieldsStep2: { field: string; value: any; }[];
  professionalFields: { field: string; value: any; }[];
  @ViewChild('successModal') successModal!: TemplateRef<any>;
  successMsg: any;
  termsAgreed: any = false;
  userId: any;
  planAndUserDetails: any = [];
  declarationMsg: string='';
  declarationAgreed: any=false;

  ngOnInit(): void {
    const fieldData = JSON.parse(sessionStorage.getItem('overallData'))
    const planDetails = JSON.parse(sessionStorage.getItem('selectedPlan'))
    this.planDetails = planDetails
    this.fieldData = fieldData
    this.planAndUserDetails.push(this.fieldData)
    this.planAndUserDetails.push(this.planDetails)
    if (sessionStorage.getItem('user')) {
      const data = JSON.parse(sessionStorage.getItem('user') || '{}');
      this.userId = data?._id
      if (!data) return;
    }
    this.populateData()
  }
  constructor(private router: Router, private paymentService: PaymentService, private ApiService: HttpWrapperService
    , private modal: NgbModal
  ) {

  }
  populateData() {
    this.studentFields = [
      { field: 'College', value: this.fieldData?.college },
      { field: 'Course', value: this?.fieldData?.course },
      { field: 'Year of Study', value: this.fieldData?.yearOfStudy },
      { field: 'Tech Stack', value: this.fieldData?.techStack }
    ];
    this.studentFieldsStep2 = [
      {
        field: 'Availability',
        value: this.fieldData?.availability,
      },
      {
        field: 'Preferred Learning Area',
        value: this.fieldData?.preferredLearningAreas,
      },
      {
        field: 'Language Comfort',
        value: this.fieldData?.languageComfort,
      }
    ];
    this.agencyFields = [
      {
        field: 'Team Size',
        value: this.fieldData?.teamSize,
      },
      {
        field: 'Poc Name',
        value: this.fieldData?.pocName,
      },
      {
        field: 'Poc Email',
        value: this.fieldData?.pocEmail,
      },
      {
        field: 'Poc PhoneNumber',
        value: this.fieldData?.pocPhoneNumber,
      },
      {
        field: 'Tech Stack',
        value: this.fieldData?.techStack,
      },
      {
        field: 'Core Services',
        value: this.fieldData?.coreServices,
      }
    ];
    this.professionalFieldsStep2 = [
      {
        field: 'Availability',
        value: this.fieldData?.availability,
      },
      {
        field: 'Preferred Project Type',
        value: this.fieldData?.preferredProjectType,
      },
      {
        field: 'Language Comfort',
        value: this.fieldData?.languageComfort,
      }
    ];
    this.agencyFieldsStep2 = [
      {
        field: 'Team Capacity',
        value: this.fieldData?.teamCapacity,
      },
      {
        field: 'Past Clients',
        value: this.fieldData?.pastClients,
      },
     
      {
        field: 'Communication Tools',
        value: this.fieldData?.communicationTools,
      },
      {
        field: 'Sales Help Required',
        value: this.fieldData?.salesHelpRequired,
      }
    ];
    this.professionalFields = [
      {
        field: 'Years of Experience',
        value: this.fieldData?.yearsOfExperience
      },
      {

        field: 'Project Descriptions',
        value: this.fieldData?.projectDescriptions
      }
    ];


  }
  editDetails() {
    const forEdit = true
    sessionStorage.setItem('forEdit', forEdit.toString())
    this.router.navigate(['/proceed-form'])
  }
  formatDate(dateStr: string): string {
    if (!dateStr) return '';

    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }); // Output: 01 May 2025
  }
  studentFields: any = [];
  studentFieldsStep2: any = [];
  activeSection: 'additional' | 'declaration' | null = null;

  toggleSection(section: 'additional' | 'declaration') {
    this.activeSection = this.activeSection === section ? null : section;
  }
  payNow(amount) {
    let body = {
      amount: amount
    }

    this.ApiService.post(Api.createPayment, body).subscribe((res: any) => {
      const options = {
        key: 'rzp_live_5d1w43eJ5rZmVE',
        amount: res.order.amount,
        currency: 'INR',
        name: 'EarnProjects',
        order_id: res.order.id,
        handler: (response: any) => {
          // Verify payment
          this.ApiService.post(Api.verifyPayment, response).subscribe((verifyRes: any) => {
            if (verifyRes?.success) {

              // this.successMsg = '✅ Payment Successful!';
              // this.modal.open(this.successModal, { size: 'md', centered: true })
              this.savePlanData(response)

            }
          });
        },
        theme: {
          color: '#7C3AED'
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();
    });
  }
  savePlanData(response: any) {
    this.successMsg=''
    let saveBody = {
      userId: this.userId,
      formDataArray: this.planAndUserDetails,
      razorpayOrderId: response.razorpay_order_id,
      razorpayPaymentId: response.razorpay_payment_id
    };

    this.ApiService.post(Api.saveUserPlan, saveBody).subscribe((result: any) => {
     if(result?.status==200){
      const dataSaved=true
      sessionStorage.setItem('planPurchased',dataSaved.toString());
      this.successMsg=result?.message
      this.modal.open(this.successModal,{size:'md',centered:true})
      
      this.router.navigate(['/dashboard'])
     }
    });
  }
 agreeToTerms() {
  this.termsAgreed = !this.termsAgreed;

  // If declaration not agreed, show message
  if (!this.declarationAgreed) {
    this.declarationMsg = 'Please agree to the incorporation declaration';
    this.toggleSection('declaration');
  }
}

agreeToDeclaration() {
  this.declarationAgreed = !this.declarationAgreed;
  this.declarationMsg = '';
}
}
