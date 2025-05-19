import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  accountType: string = 'student'; // Default selection
  agreedToTerms: boolean = false;

  onSubmit() {
    console.log('Signup form submitted');
    // Add your form submission logic here
  }
}