import { Component } from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from '@angular/animations';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
  animations: [
    trigger('slideInRight', [
      transition(':enter', [
        query('.hero-options', [
          style({ transform: 'translateX(100%)', opacity: 0 }),
          stagger(200, [
            animate('800ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
          ])
        ])
      ])
    ])
    
  ]
})
export class HeroComponent {}
