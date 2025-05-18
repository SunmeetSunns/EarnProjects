 import { Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { HeroComponent } from './hero/hero.component';
import { OfferingsComponent } from './offerings/offerings.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { WhyusComponent } from './whyus/whyus.component';

export const MAIN_ROUTES: Routes = [
  { path: '', component: HeaderComponent, outlet: 'header' },
  { path: '', component: HeroComponent },
  { path: '', component: OfferingsComponent },
  { path: '', component: TestimonialsComponent },
  { path: '', component: WhyusComponent }
];