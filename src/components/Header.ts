import { $, throttle } from '@/utils/helpers';

export class Header {
  private header: HTMLElement | null;
  private scrollThreshold: number;

  constructor(scrollThreshold: number = 50) {
    this.header = $('.main-header');
    this.scrollThreshold = scrollThreshold;

    this.init();
  }

  private init(): void {
    if (!this.header) return;

    // Initial check
    this.handleScroll();

    // Setup scroll listener with throttling for performance
    window.addEventListener('scroll', throttle(() => this.handleScroll(), 100));
  }

  private handleScroll(): void {
    if (!this.header) return;

    const isScrolled = window.scrollY > this.scrollThreshold;
    
    this.header.classList.toggle('scrolled', isScrolled);
    this.header.classList.toggle('shadow-soft', isScrolled);
    this.header.classList.toggle('shadow-none', !isScrolled);
  }
}
