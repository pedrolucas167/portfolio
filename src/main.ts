/**
 * Portfolio - Main Entry Point
 * Pedro Marques - Software Engineer
 * 
 * Built with TypeScript, Tailwind CSS, and modern best practices.
 */

import '@/styles/main.css';
import { 
  ThemeManager, 
  MobileMenu, 
  TypingEffect, 
  ScrollAnimations, 
  Header,
  Particles,
  ProjectModal
} from '@/components';
import { ContactForm } from '@/components/ContactForm';
import { $ } from '@/utils/helpers';

class Portfolio {
  constructor() {
    this.init();
  }

  private init(): void {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  private setup(): void {
    // Update copyright year
    this.updateCopyrightYear();

    // Initialize all components
    new ThemeManager();
    new MobileMenu();
    new TypingEffect();
    new ScrollAnimations();
    new Header();
    new Particles();
    new ProjectModal();
    
    // Initialize contact form
    const contactForm = new ContactForm();
    contactForm.init();

    // Setup smooth scroll for anchor links
    this.setupSmoothScroll();
  }

  private updateCopyrightYear(): void {
    const yearElement = $('#current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear().toString();
    }
  }

  private setupSmoothScroll(): void {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });

          // Update URL without triggering navigation
          history.pushState(null, '', href);
        }
      });
    });
  }
}

// Initialize the portfolio
new Portfolio();
