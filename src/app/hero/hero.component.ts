import { Component } from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from '@angular/animations';
import { Router } from '@angular/router';

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
export class HeroComponent {
  constructor(private router: Router) {

  }
  routeToSignup(action?:any) {
    if(action){
      this.router.navigate(['/offerings'])
    }
    else{
 this.router.navigate(['/signup'])
    }
   
  }
  routeToPlan(plan:any){
this.router.navigate([`/plans/${plan}`])
  }
}
