import { $$, prefersReducedMotion } from '@/utils/helpers';

export class ScrollAnimations {
  private observer: IntersectionObserver | null = null;
  private sections: NodeListOf<HTMLElement>;

  constructor(selector: string = '[data-animate]') {
    this.sections = $$(selector);

    if (!prefersReducedMotion()) {
      this.init();
    } else {
      // Show all sections immediately if user prefers reduced motion
      this.showAllSections();
    }
  }

  private init(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.classList.add('animate-fade-in-up');
            target.style.opacity = '1';
            this.observer?.unobserve(target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    this.sections.forEach((section) => {
      // Set initial state
      section.style.opacity = '0';
      this.observer?.observe(section);
    });
  }

  private showAllSections(): void {
    this.sections.forEach((section) => {
      section.style.opacity = '1';
    });
  }

  public destroy(): void {
    this.observer?.disconnect();
  }
}
