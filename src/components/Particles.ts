import { PARTICLES_CONFIG } from '@/config/constants';
import { $, prefersReducedMotion } from '@/utils/helpers';

export class Particles {
  private containerId: string;
  private isInitialized: boolean = false;

  constructor(containerId: string = 'particles-js') {
    this.containerId = containerId;

    // Don't initialize if user prefers reduced motion
    if (!prefersReducedMotion()) {
      this.init();
    }
  }

  private init(): void {
    // Wait for particlesJS to be available
    if (typeof window.particlesJS !== 'undefined') {
      this.initParticles();
    } else {
      // Try again after a short delay (library might still be loading)
      setTimeout(() => {
        if (typeof window.particlesJS !== 'undefined') {
          this.initParticles();
        } else {
          console.warn('particles.js library not found');
        }
      }, 500);
    }
  }

  private initParticles(): void {
    window.particlesJS(this.containerId, PARTICLES_CONFIG);
    this.isInitialized = true;

    // Ensure canvas is behind content
    const canvas = $(`#${this.containerId} canvas`);
    if (canvas) {
      canvas.style.zIndex = '-1';
      canvas.style.position = 'absolute';
    }

    // Update particles color based on theme
    window.addEventListener('themechange', (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: string }>;
      this.updateParticlesColor(customEvent.detail.theme);
    });
  }

  private updateParticlesColor(theme: string): void {
    // Particles work well on both themes with white color
    // But you could adjust if needed
    if (theme === 'dark') {
      // Could adjust particle behavior for dark mode
    }
  }

  public isActive(): boolean {
    return this.isInitialized;
  }
}
