import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  constructor(private router: Router,private modal:NgbModal) {

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
  openAboutModal(popup) {
  this.modal.open(popup,{size:'lg',centered:true})
}
}
