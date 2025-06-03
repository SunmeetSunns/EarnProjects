import { Component, HostListener, AfterViewInit, ElementRef, Renderer2, ChangeDetectorRef, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginServiceService } from '../services/login-service.service';
import { Offcanvas } from 'bootstrap';  // bootstrap JS import

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  @ViewChild('dropdownRef') dropdownRef!: ElementRef;
  @ViewChild('headerRef') headerRef!: ElementRef;
  @ViewChild('offcanvasRef', { static: false }) offcanvasRef!: ElementRef;

  isScrolled: boolean = false;
  dropDownValues: any[] = [];
  show: boolean = false;
  currentDrop: string;
  isLoggedIn: any;
  showProfile: boolean = false;
  isLaptop: boolean = false;
  activeDropdown: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2, public router: Router, private zone: NgZone, public loginService: LoginServiceService) { }

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
  ngOnInit() {
    this.checkWindowSize(); // run on init

    // Use NgZone to force Angular to be aware of change
    window.addEventListener('resize', () => {
      this.zone.run(() => {
        this.checkWindowSize();
      });
    });

    // Login check
    this.loginService.isLoggedIn$.subscribe((status: boolean) => {
      this.isLoggedIn = status;
    });
  }



  checkWindowSize(): void {
    const isNowLaptop = window.innerWidth > 1024;

    if (this.isLaptop !== isNowLaptop) {
      this.isLaptop = isNowLaptop;
      console.log('Window resized, isLaptop:', this.isLaptop); // Debug log
    }
  }



  openProfile() {
    this.showProfile = !this.showProfile
  }
  routeToSignup() {
    this.router.navigate(['/signup'])
  }
  // applyClasses(plan: string) {
  //   this.activeDropdown = this.activeDropdown === plan ? '' : plan;
  //   this.currentDrop = plan;
  //   this.show = true;
  //   if (plan === 'ourPlan') {
  //     this.dropDownValues = [
  //       { Planname: 'All Plans', src: '../../assets/svg/all-plan.svg' },
  //       { Planname: 'Student Plans', src: '../../assets/svg/stud-plan.svg' },
  //       { Planname: 'Professional Plans', src: '../../assets/svg/prof-plan.svg' },
  //       { Planname: 'Agency Plans', src: '../../assets/svg/comp-plan.svg' }
  //     ];
  //   } else if (plan === 'renewPlan') {
  //     this.show = false;
  //     this.dropDownValues = []
  //     return;
  //   } else if (plan === 'support') {
  //     this.dropDownValues = [
  //       { Planname: 'WhatsApp', src: '../../assets/svg/wapp.svg' },
  //       { Planname: 'Mail Us', src: '../../assets/svg/mail.svg' },
  //       { Planname: 'Contact Us', src: '../../assets/svg/phn-support.svg' }
  //     ];
  //   }
  // }
  applyClasses(plan: string) {
  this.activeDropdown = this.activeDropdown === plan ? '' : plan;
  this.currentDrop = plan;

  if (plan === 'renewPlan') {
    this.show = false;
    this.dropDownValues = [];
    return;
  }

  this.show = true;

  if (plan === 'ourPlan') {
    this.dropDownValues = [
      { Planname: 'All Plans', src: '../../assets/svg/all-plan.svg' },
      { Planname: 'Student Plans', src: '../../assets/svg/stud-plan.svg' },
      { Planname: 'Professional Plans', src: '../../assets/svg/prof-plan.svg' },
      { Planname: 'Agency Plans', src: '../../assets/svg/comp-plan.svg' }
    ];
  } else if (plan === 'support') {
    this.dropDownValues = [
      { Planname: 'WhatsApp', src: '../../assets/svg/wapp.svg' },
      { Planname: 'Mail Us', src: '../../assets/svg/mail.svg' },
      { Planname: 'Contact Us', src: '../../assets/svg/phn-support.svg' }
    ];
  }
}

  performAction(actionName: any, choosePlan: any) {
    this.closeOffcanvas()
    if (actionName === 'ourPlan') {
      this.show = false;
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
  //For supoorty dialog box
  handleSupportAction(planName: string) {
  this.closeOffcanvas(); // Close the hamburger menu (offcanvas) first

  if (planName === 'WhatsApp') {
    window.open('https://wa.me/9835490474', '_blank');
  } else if (planName === 'Mail Us') {
    window.location.href = 'mailto:abhishek.jha@earnprojects.com';
  } else if (planName === 'Contact Us') {
    window.location.href = 'tel:9835490474'; 
  }
}

  logout() {
    this.showProfile = false;
    this.loginService.logout();
    this.router.navigate(['/'])
  }
  clearData() {
    this.activeDropdown = ''
  }
  closeOffcanvas() {
    if (this.offcanvasRef && this.offcanvasRef.nativeElement) {
      const bsOffcanvas = Offcanvas.getInstance(this.offcanvasRef.nativeElement);
      if (bsOffcanvas) {
        bsOffcanvas.hide();
      }

      // ✅ Manually remove the backdrop (bootstrap backdrop class)
      const backdrops = document.querySelectorAll('.offcanvas-backdrop');
      backdrops.forEach((bd) => bd.remove());

      // ✅ Remove body class that prevents scroll (Bootstrap adds this)
      document.body.classList.remove('offcanvas-backdrop');
      document.body.classList.remove('modal-open'); // just in case
      document.body.style.overflow = '';
    } else {
      console.warn('offcanvasRef not available yet');
    }
  }



}
