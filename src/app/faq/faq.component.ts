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
        question: 'How do the project leads work?',
        answer: "We source and verify real project opportunities from businesses and individuals. Once subscribed, you'll receive leads matching your expertise and preferences directly in your dashboard.",
        show: false,
      },
      {
        question: 'Is there a free trial available?',
        answer: 'No, we don’t offer a free trial. However, you can explore sample projects and platform details on our homepage to see how it works before subscribing.',
        show: false,
      },
      {
        question: 'Can I cancel my subscription at any time?',
        answer: "Absolutely. You can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your current billing period.",
        show: false,
      },
      {
        question: 'How are project leads verified?',
        answer: 'Our team thoroughly vets each project lead through a comprehensive verification process, checking client authenticity, project scope, and budget to ensure quality opportunities.',
        show: false,
      },
      {
        question: "What happens if I don't use all my monthly leads?",
        answer: "Unused leads from your monthly quota expire at the end of each billing cycle. We encourage active participation to make the most of your subscription.",
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
      keyboard:true
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
