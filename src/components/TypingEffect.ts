import type { TypingConfig } from '@/types';
import { $, prefersReducedMotion, wait } from '@/utils/helpers';
import { TYPING_CONFIG } from '@/config/constants';

export class TypingEffect {
  private element: HTMLElement | null;
  private config: TypingConfig;
  private currentPhraseIndex: number = 0;
  private currentCharIndex: number = 0;
  private isDeleting: boolean = false;
  private isRunning: boolean = true;

  constructor(selector: string = '.typing-text', config?: Partial<TypingConfig>) {
    this.element = $(selector);
    this.config = { ...TYPING_CONFIG, ...config };

    if (this.element && !prefersReducedMotion()) {
      this.start();
    } else if (this.element) {
      // If user prefers reduced motion, just show first phrase
      this.element.textContent = this.config.phrases[0] ?? '';
    }
  }

  private async start(): Promise<void> {
    while (this.isRunning && this.element) {
      await this.tick();
    }
  }

  private async tick(): Promise<void> {
    const currentPhrase = this.config.phrases[this.currentPhraseIndex];
    if (!currentPhrase || !this.element) return;

    if (this.isDeleting) {
      this.currentCharIndex--;
      this.element.textContent = currentPhrase.substring(0, this.currentCharIndex);

      if (this.currentCharIndex === 0) {
        this.isDeleting = false;
        this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.config.phrases.length;
      }

      await wait(this.config.deleteSpeed);
    } else {
      this.currentCharIndex++;
      this.element.textContent = currentPhrase.substring(0, this.currentCharIndex);

      if (this.currentCharIndex === currentPhrase.length) {
        this.isDeleting = true;
        await wait(this.config.pauseTime);
      } else {
        await wait(this.config.typeSpeed);
      }
    }
  }

  public stop(): void {
    this.isRunning = false;
  }

  public resume(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.start();
    }
  }
}
