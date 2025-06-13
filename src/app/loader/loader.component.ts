import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
 isLoading = false;

  constructor(private spinnerService: LoaderService) {
    this.spinnerService.loading$.subscribe(status => {
      this.isLoading = status;
    });
  }
}
