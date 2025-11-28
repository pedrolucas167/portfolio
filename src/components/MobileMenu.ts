import { $, $$ } from '@/utils/helpers';

export class MobileMenu {
  private toggleButton: HTMLElement | null;
  private nav: HTMLElement | null;
  private navLinks: NodeListOf<HTMLElement>;
  private isOpen: boolean = false;

  constructor() {
    this.toggleButton = $('.mobile-menu-toggle');
    this.nav = $('#primary-navigation');
    this.navLinks = $$('.nav-link');

    this.init();
  }

  private init(): void {
    this.setupEventListeners();
    this.setupEscapeKey();
    this.setupClickOutside();
  }

  private setupEventListeners(): void {
    this.toggleButton?.addEventListener('click', () => {
      this.toggle();
    });

    // Close menu when a nav link is clicked
    this.navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (this.isOpen) {
          this.close();
        }
      });
    });
  }

  private setupEscapeKey(): void {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
        this.toggleButton?.focus();
      }
    });
  }

  private setupClickOutside(): void {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      if (
        this.isOpen &&
        !this.nav?.contains(target) &&
        !this.toggleButton?.contains(target)
      ) {
        this.close();
      }
    });
  }

  private toggle(): void {
    this.isOpen ? this.close() : this.open();
  }

  private open(): void {
    this.isOpen = true;
    this.toggleButton?.setAttribute('aria-expanded', 'true');
    this.nav?.classList.add('open');
    this.updateIcon('times');
    
    // Trap focus within menu
    this.navLinks[0]?.focus();
  }

  private close(): void {
    this.isOpen = false;
    this.toggleButton?.setAttribute('aria-expanded', 'false');
    this.nav?.classList.remove('open');
    this.updateIcon('bars');
  }

  private updateIcon(iconName: 'bars' | 'times'): void {
    const icon = this.toggleButton?.querySelector('i');
    if (icon) {
      icon.className = `fas fa-${iconName}`;
    }
  }
}
