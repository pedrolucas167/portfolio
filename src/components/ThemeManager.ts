import type { Theme } from '@/types';
import { $, prefersDarkMode } from '@/utils/helpers';

const STORAGE_KEY = 'portfolio-theme';

export class ThemeManager {
  private currentTheme: Theme;
  private toggleButton: HTMLElement | null;
  private icon: HTMLElement | null;

  constructor() {
    this.currentTheme = this.getInitialTheme();
    this.toggleButton = $('.theme-toggle');
    this.icon = this.toggleButton?.querySelector('i') ?? null;
    
    this.init();
  }

  private getInitialTheme(): Theme {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored) return stored;
    return prefersDarkMode() ? 'dark' : 'light';
  }

  private init(): void {
    this.applyTheme(this.currentTheme);
    this.setupEventListeners();
    this.setupSystemThemeListener();
  }

  private setupEventListeners(): void {
    this.toggleButton?.addEventListener('click', () => {
      this.toggle();
    });
  }

  private setupSystemThemeListener(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem(STORAGE_KEY)) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  private applyTheme(theme: Theme): void {
    this.currentTheme = theme;
    
    // Update DOM
    document.documentElement.classList.toggle('dark', theme === 'dark');
    
    // Update icon
    if (this.icon) {
      this.icon.className = `fas fa-${theme === 'dark' ? 'sun' : 'moon'}`;
    }

    // Update aria-label for accessibility
    if (this.toggleButton) {
      this.toggleButton.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'
      );
    }

    // Persist preference
    localStorage.setItem(STORAGE_KEY, theme);

    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  public toggle(): void {
    const newTheme: Theme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }

  public getTheme(): Theme {
    return this.currentTheme;
  }
}
