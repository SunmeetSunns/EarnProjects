import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { HeroComponent } from './hero/hero.component';
import { WhyusComponent } from "./whyus/whyus.component";
import { OfferingsComponent } from './offerings/offerings.component';
import { TestimonialsComponent } from "./testimonials/testimonials.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, HeroComponent, WhyusComponent, OfferingsComponent, TestimonialsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'EarnProject';
}
