import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  constructor(private router: Router) {

  }
  performAction(action: any) {
    if (action == 'pricing') {
      this.router.navigate(['/plans/all'])
    }
    if (action == 'support') {
      this.scrollToTop()
    }
    if(action=='faq'){
      this.router.navigate(['/faq'])
    }

  }
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
