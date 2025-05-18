//  import { Component } from '@angular/core';
// import { HeaderComponent } from '../header/header.component';
// import { HeroComponent } from '../hero/hero.component';
// import { OfferingsComponent } from '../offerings/offerings.component';
// import { TestimonialsComponent } from '../testimonials/testimonials.component';
// import { WhyusComponent } from '../whyus/whyus.component';

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [
//     HeaderComponent,
//     HeroComponent,
//     OfferingsComponent, 
//     TestimonialsComponent,
//     WhyusComponent
//   ],
//   template: `
//     <app-header />
//     <app-hero />
//     <app-offerings />
//     <app-testimonials />
//     <app-whyus />
//   `,
// })
// export class HomeComponent {}
// home.component.ts
import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { HeroComponent } from '../hero/hero.component';
import { OfferingsComponent } from '../offerings/offerings.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { WhyusComponent } from '../whyus/whyus.component';

@Component({
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    WhyusComponent,
    OfferingsComponent,
    TestimonialsComponent
  ],
  template: `
    <app-header></app-header>
    <app-hero></app-hero>
    <app-whyus></app-whyus>
    <app-offerings></app-offerings>
    <app-testimonials></app-testimonials>
  `
})
export class HomeComponent {}