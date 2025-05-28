import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-review-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-detail.component.html',
  styleUrl: './review-detail.component.css'
})
export class ReviewDetailComponent {

activeSection: 'additional' | 'declaration' | null = null;

toggleSection(section: 'additional' | 'declaration') {
  this.activeSection = this.activeSection === section ? null : section;
}

}
