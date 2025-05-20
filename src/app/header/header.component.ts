import { Component, HostListener, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewChild } from '@angular/core';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements AfterViewInit {
  @ViewChild('dropdownRef') dropdownRef!: ElementRef;
@ViewChild('headerRef') headerRef!: ElementRef;

  isScrolled: boolean = false;
  dropDownValues: any[] = [];
  show: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

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
  this.show = true;
  if (plan === 'ourPlan') {
    this.dropDownValues = [
      { showPlanName: 'ourPlan' },
      { Planname: 'All Plans', src: '../../assets/svg/all-plan.svg' },
      { Planname: 'Student Plans', src: '../../assets/svg/stud-plan.svg' },
      { Planname: 'Professional Plans', src: '../../assets/svg/prof-plan.svg' },
      { Planname: 'Agency Plans', src: '../../assets/svg/comp-plan.svg' }
    ];
  } else if (plan === 'reviewPlan') {
    this.dropDownValues = [
    ];
  } else if (plan === 'support') {
    this.dropDownValues = [
      { showPlanName: 'supportPlan' },
      { Planname: 'WhatsApp', src: '../../assets/svg/wapp.svg' },
      { Planname: 'Mail Us', src: '../../assets/svg/mail.svg' },
      { Planname: 'Contact Us', src: '../../assets/svg/phn-support.svg' }
    ];
  }
}


}
