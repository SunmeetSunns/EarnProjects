import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpWrapperService } from '../services/api-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Api } from '../services/api-enums';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent implements OnInit {

  faqs: any[] = [];
  expertForm!: FormGroup;
  successMsg: any;
  @ViewChild('successModal') successModal!: TemplateRef<any>;
  ngOnInit(): void {
    this.populateFaqs();
  }
  constructor(private ApiService: HttpWrapperService, private formBuilder: FormBuilder, private modal: NgbModal) {

  }
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  populateFaqs() {
    this.faqs = [
      {
        question: "What is EarnProjects?",
        answer: "EarnProjects is a subscription-based project outsourcing and collaboration platform that connects businesses and agencies with a curated team of experts in Web, Mobile, Dashboard development, and Marketing. We handle everything from client acquisition to project delivery -- you only focus on execution.",
        show: false,
      },
      {
        question: "How does EarnProjects work?",
        answer: "Once you subscribe to one of our plans, our team will actively bring you suitable, qualified projects through Upwork bidding, outbound marketing, and our internal client network. You select the projects that fit your team’s skillset. We manage communication, expectations, and delivery timelines -- all under the EarnProjects umbrella.",
        show: false,
      },
      {
        question: "Do I have to search for projects or clients myself?",
        answer: "No. That’s our job. Our core service is to bring the right clients to you — pre-qualified and aligned with your expertise. You just need to focus on building and delivering the solution.",
        show: false,
      },
      {
        question: "Can clients contact me directly?",
        answer: "All client communications are managed by EarnProjects to ensure transparency, consistency, and professionalism. If required, we will arrange project-specific communication -- always under the EarnProjects brand.",
        show: false,
      },
      {
        question: "What kind of projects can I expect?",
        answer: "We match projects based on your expertise in Web, Mobile Apps, Dashboards (Admin Panels), and Marketing. We work with clients from multiple industries including SaaS, Healthcare, Education, Real Estate, Retail, and more.",
        show: false,
      },
      {
        question: "Is there a contract?",
        answer: "There’s no need for a separate contract -- everything is covered under our subscription model. You have full flexibility to upgrade, downgrade, or cancel your subscription at any time, depending on your business capacity. We believe in commitment through value, not long-term lock-ins.",
        show: false,
      },
      {
        question: "Can I speak to someone before subscribing?",
        answer: "Yes! You can schedule a free consultation with our team to understand how EarnProjects can add value to your business.",
        show: false,
      },
      {
        question: "What is your cancellation and refund policy for subscriptions?",
        answer: "At EarnProjects, we offer a subscription-based service with immediate access to client project upon activation. Because of the nature of digital access, we do not offer refunds once a subscription is active.However, you can cancel your subscription at any time to avoid future billing. Your access will continue until the end of your current billing cycle.",
        show: false,
      }
    ]
  }
  openQues(index: number) {
    this.faqs.forEach((faq, i) => {
      faq.show = i === index ? !faq.show : false;
    });
  }
  talkToExpert(popup) {
    this.buildForm()
    this.modal.open(popup, {
      size: 'md',
      centered: true,
      keyboard: true
      // prevent ESC close
    });
  }
  buildForm() {
    this.expertForm = this.formBuilder.group({
      mobile: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[6-9][0-9]{9}$')]],
    });
  }
  submitForm() {
    if (this.expertForm.invalid) {
      this.expertForm.markAllAsTouched();
      return;
    }
    let body = {
      phone: this.expertForm.get('mobile').value
    }
    this.ApiService.post(Api.talkToExpert, body).subscribe((res: any) => {
      if (res?.status == 200) {
        this.modal.dismissAll()
        this.successMsg = res?.message
        this.modal.open(this.successModal, { size: 'md', centered: true })


      }
    })
  }
}
