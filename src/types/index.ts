// Type definitions for the portfolio
export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  ariaLabel: string;
}

export interface TechStack {
  name: string;
  icon: string;
  category: 'language' | 'framework' | 'database' | 'tool';
}

export interface TypingConfig {
  phrases: string[];
  typeSpeed: number;
  deleteSpeed: number;
  pauseTime: number;
}

export interface ParticlesConfig {
  particles: {
    number: { value: number; density: { enable: boolean; value_area: number } };
    color: { value: string };
    shape: { type: string };
    opacity: { value: number; random: boolean };
    size: { value: number; random: boolean };
    line_linked: { enable: boolean };
    move: { enable: boolean; speed: number; random: boolean; out_mode: string };
  };
  interactivity: {
    detect_on: string;
    events: { onhover: { enable: boolean; mode: string } };
    modes: { repulse: { distance: number; duration: number } };
  };
  retina_detect: boolean;
}

export type Theme = 'light' | 'dark';

declare global {
  interface Window {
    particlesJS: (elementId: string, config: ParticlesConfig) => void;
  }
}
