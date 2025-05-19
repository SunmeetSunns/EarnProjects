import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent implements OnInit{

  faqs:any[]=[];


  ngOnInit(): void {
    this.populateFaqs();  }
constructor(){

}
populateFaqs(){
this.faqs=[
  {
    question:'How do the project leads work?',
    answer:"We source and verify real project opportunities from businesses and individuals. Once subscribed, you'll receive leads matching your expertise and preferences directly in your dashboard.",
    show:false,
  },
  {
    question:'Is there a free trial available?',
    answer:"Yes! We offer a 14-day free trial on all plans. You'll get access to sample project leads to understand how the platform works.",
    show:false,
  },
  {
    question:'Can I cancel my subscription at any time?',
    answer:"Absolutely. You can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your current billing period.",
    show:false,
  },
  {
    question:'How are project leads verified?',
    answer:'Our team thoroughly vets each project lead through a comprehensive verification process, checking client authenticity, project scope, and budget to ensure quality opportunities.',
    show:false,
  },
  {
    question:"What happens if I don't use all my monthly leads?",
    answer:"Unused leads from your monthly quota expire at the end of each billing cycle. We encourage active participation to make the most of your subscription.",
    show:false,
  }
]
}
openQues(index: number) {
  this.faqs.forEach((faq, i) => {
    faq.show = i === index ? !faq.show : false;
  });
}


}
