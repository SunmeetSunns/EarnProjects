import { Component, HostListener, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements AfterViewInit {
  isScrolled: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

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

 ngAfterViewInit(): void {
  const menuItems: NodeListOf<HTMLElement> = this.el.nativeElement.querySelectorAll('#menu li');
  menuItems.forEach((item: HTMLElement) => {
    item.addEventListener('click', () => {
      menuItems.forEach((el: HTMLElement) => el.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

}
