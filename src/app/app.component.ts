import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { HeroComponent } from './hero/hero.component';
import { WhyusComponent } from "./whyus/whyus.component";
import { OfferingsComponent } from './offerings/offerings.component';
import { TestimonialsComponent } from "./testimonials/testimonials.component";
import { FaqComponent } from './faq/faq.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { LoaderComponent } from "./loader/loader.component";
import { LoginServiceService } from './services/login-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, FooterComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    this.startTokenExpiryTimer();
  }
  constructor(private loginService: LoginServiceService, public router: Router) {

  }
  startTokenExpiryTimer() {
    const token = sessionStorage.getItem('authToken');
    const loginTime = sessionStorage.getItem('loginTime');
    const expiryTime = 60 * 60 * 1000; // 1 hour
    if (token && loginTime) {
      const timePassed = Date.now() - parseInt(loginTime);
      const timeLeft = expiryTime - timePassed;
      console.log(timeLeft)
      if (timeLeft <= 0) {
        this.logoutUser();
      } else {
        setTimeout(() => {
          this.logoutUser();
        }, timeLeft);
      }
    }
  }

  logoutUser() {
    sessionStorage.clear();
    this.loginService.setLoginStatus(false);
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  title = 'EarnProject';
}
