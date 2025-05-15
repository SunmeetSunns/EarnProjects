import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent implements OnInit, OnDestroy {
  currentTestimonialIndex: number = 0;
  intervalId: any;
  animate: boolean = false;

  testimonials = [
    {
      name: "Rahul Sharma",
      role: "Freelance Designer",
      photo: "../../assets/images/rahul.jpeg",
      message: "ProjectXchange helped me gain real-world experience while studying. The project leads are high-quality, and I've earned enough to support my education!"
    },
    {
      name: "Anjali Verma",
      role: "Agency Owner, TechSolutions India",
      photo: "../../assets/images/anjali.jpeg",
      message: "The quality of project leads is outstanding. I've been able to grow my freelance business consistently, and the flexible nature of the platform suits my lifestyle perfectly."
    },
    {
      name: "Prem Patel",
      role: "Freelance Designer, Independent Professional",
      photo: "../../assets/images/peter.jpeg",
      message: "This platform has been instrumental in scaling our agency. The premium plan provides exactly the kind of high-value leads we need, and the white-label feature is a game-changer."
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoRotation();
      this.triggerAnimation();
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.stopAutoRotation();
    }
  }

  startAutoRotation() {
    this.intervalId = setInterval(() => {
      this.nextTestimonial();
    }, 7000);
  }

  stopAutoRotation() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  triggerAnimation() {
    this.animate = false;
    setTimeout(() => {
      this.animate = true;
    }, 50);
  }

  nextTestimonial() {
    this.currentTestimonialIndex =
      (this.currentTestimonialIndex + 1) % this.testimonials.length;
    this.triggerAnimation();
  }

  previousTestimonial() {
    this.currentTestimonialIndex =
      (this.currentTestimonialIndex - 1 + this.testimonials.length) % this.testimonials.length;
    this.triggerAnimation();
  }

  onNextClick() {
    if (isPlatformBrowser(this.platformId)) {
      this.stopAutoRotation();
      this.nextTestimonial();
      this.startAutoRotation();
    }
  }

  onPrevClick() {
    if (isPlatformBrowser(this.platformId)) {
      this.stopAutoRotation();
      this.previousTestimonial();
      this.startAutoRotation();
    }
  }

  goToTestimonial(index: number) {
    if (isPlatformBrowser(this.platformId)) {
      this.stopAutoRotation();
      this.currentTestimonialIndex = index;
      this.triggerAnimation();
      this.startAutoRotation();
    }
  }
}
