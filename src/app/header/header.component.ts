import { Component, HostListener, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewChild } from '@angular/core';
import { Router ,RouterModule} from '@angular/router';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements AfterViewInit {
  @ViewChild('dropdownRef') dropdownRef!: ElementRef;
  @ViewChild('headerRef') headerRef!: ElementRef;

  isScrolled: boolean = false;
  dropDownValues: any[] = [];
  show: boolean = false;
  currentDrop: string;
  

  constructor(private el: ElementRef, private renderer: Renderer2, public router: Router) { }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollTop > 0;

    const header = document.getElementById('header');
    if (header) {
      if (this.isScrolled) {
        header.classList.add('shadow');
      } else {
        header.classList.remove('shadow');
      }
    }
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInsideHeader = this.headerRef?.nativeElement.contains(event.target);
    const clickedInsideDropdown = this.dropdownRef?.nativeElement.contains(event.target);

    if (!clickedInsideHeader && !clickedInsideDropdown) {
      this.show = false;
    }
  }

  ngAfterViewInit(): void {
    const menuItems: NodeListOf<HTMLElement> = this.el.nativeElement.querySelectorAll('#menu .menu-item');
    menuItems.forEach((item: HTMLElement) => {
      item.addEventListener('click', () => {
        menuItems.forEach((el: HTMLElement) => el.classList.remove('active'));
        item.classList.add('active');
      });
    });
  }

  applyClasses(plan: string) {
    this.currentDrop = plan;
    this.show = true;
    if (plan === 'ourPlan') {
      this.dropDownValues = [
        { Planname: 'All Plans', src: '../../assets/svg/all-plan.svg' },
        { Planname: 'Student Plans', src: '../../assets/svg/stud-plan.svg' },
        { Planname: 'Professional Plans', src: '../../assets/svg/prof-plan.svg' },
        { Planname: 'Agency Plans', src: '../../assets/svg/comp-plan.svg' }
      ];
    } else if (plan === 'renewPlan') {
      this.dropDownValues = []
      return;
    } else if (plan === 'support') {
      this.dropDownValues = [
        { Planname: 'WhatsApp', src: '../../assets/svg/wapp.svg' },
        { Planname: 'Mail Us', src: '../../assets/svg/mail.svg' },
        { Planname: 'Contact Us', src: '../../assets/svg/phn-support.svg' }
      ];
    }
  }
 performAction(actionName: any, choosePlan: any) {
  if (actionName === 'ourPlan') {
    this.show=false;
    if (choosePlan === 'All Plans') {
      this.router.navigate(['/plans/all']);
    } else if (choosePlan === 'Student Plans') {
      this.router.navigate(['/plans/student']);
    } else if (choosePlan === 'Professional Plans') {
      this.router.navigate(['/plans/professional']);
    } else if (choosePlan === 'Agency Plans') {
      this.router.navigate(['/plans/agency']);
    }
  }

  if (actionName === 'renewPlans') {
    // Add renew navigation if needed
    return;
  }
}


}
