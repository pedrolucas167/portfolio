import { $ } from '../utils/helpers';

// URL do Formspree
const API_URL = 'https://formspree.io/f/xeobzpbb';

export class ContactForm {
  private form: HTMLFormElement | null;
  private submitBtn: HTMLButtonElement | null;
  private statusDiv: HTMLElement | null;
  private originalBtnText: string = '';
  private typingTimers: Map<HTMLElement, number> = new Map();

  constructor() {
    this.form = document.querySelector<HTMLFormElement>('#contact-form');
    this.submitBtn = this.form?.querySelector('button[type="submit"]') ?? null;
    this.statusDiv = $('#form-status');
    
    if (this.submitBtn) {
      this.originalBtnText = this.submitBtn.innerHTML;
    }
  }

  init(): void {
    if (!this.form) return;

    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Add input events for visual feedback
    this.form.querySelectorAll('input, textarea').forEach(input => {
      const el = input as HTMLInputElement | HTMLTextAreaElement;
      
      // Focus - highlight azul
      el.addEventListener('focus', () => this.handleFocus(el));
      
      // Blur - validar
      el.addEventListener('blur', () => this.handleBlur(el));
      
      // Input - mostrar cor verde enquanto digita
      el.addEventListener('input', () => this.handleInput(el));
    });
  }

  private handleFocus(input: HTMLInputElement | HTMLTextAreaElement): void {
    input.classList.remove('error', 'valid');
    // O CSS cuida do focus state azul
  }

  private handleInput(input: HTMLInputElement | HTMLTextAreaElement): void {
    // Limpar erro ao digitar
    this.clearFieldError(input);
    
    // Adicionar classe "typing" (verde) enquanto digita
    input.classList.add('typing');
    input.classList.remove('valid', 'error');
    
    // Limpar timer anterior
    const existingTimer = this.typingTimers.get(input);
    if (existingTimer) {
      window.clearTimeout(existingTimer);
    }
    
    // Após parar de digitar por 500ms, validar e mostrar estado
    const timer = window.setTimeout(() => {
      input.classList.remove('typing');
      
      // Validar e mostrar verde se válido
      if (input.value.trim()) {
        const isValid = this.validateFieldSilent(input);
        if (isValid) {
          input.classList.add('valid');
        }
      }
    }, 500);
    
    this.typingTimers.set(input, timer);
  }

  private handleBlur(input: HTMLInputElement | HTMLTextAreaElement): void {
    input.classList.remove('typing');
    
    // Limpar timer
    const timer = this.typingTimers.get(input);
    if (timer) {
      window.clearTimeout(timer);
      this.typingTimers.delete(input);
    }
    
    // Validar ao sair do campo
    this.validateField(input);
  }

  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();
    
    if (!this.form || !this.submitBtn) return;

    // Validate all fields
    const isValid = this.validateForm();
    if (!isValid) return;

    // Show loading state
    this.setLoadingState(true);

    try {
      // Preparar dados do formulário para Formspree
      const formData = new FormData(this.form);

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      const result = await response.json();
      console.log('Formspree response:', result);

      if (response.ok) {
        this.showStatus('success', '✓ Mensagem enviada com sucesso! Entrarei em contato em breve.');
        this.form.reset();
        // Limpar estados visuais
        this.form.querySelectorAll('.form-input').forEach(input => {
          input.classList.remove('valid', 'typing', 'error');
        });
      } else {
        console.error('Formspree error:', result);
        if (result.errors) {
          const errorMessages = result.errors.map((err: { message: string }) => err.message).join(', ');
          this.showStatus('error', `Erro: ${errorMessages}`);
        } else if (result.error) {
          this.showStatus('error', `Erro: ${result.error}`);
        } else {
          this.showStatus('error', 'Ocorreu um erro ao enviar. Tente novamente.');
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.showStatus('error', 'Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      this.setLoadingState(false);
    }
  }

  private validateForm(): boolean {
    if (!this.form) return false;

    const inputs = this.form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input as HTMLInputElement)) {
        isValid = false;
      }
    });

    return isValid;
  }

  // Validação silenciosa (sem mostrar erro)
  private validateFieldSilent(input: HTMLInputElement | HTMLTextAreaElement): boolean {
    const value = input.value.trim();

    if (input.hasAttribute('required') && !value) return false;
    
    if (input.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return false;
    }

    if (input.id === 'message' && value && value.length < 10) return false;

    return true;
  }

  private validateField(input: HTMLInputElement | HTMLTextAreaElement): boolean {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    if (input.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'Este campo é obrigatório';
    }
    
    if (input.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Digite um e-mail válido';
      }
    }

    if (input.id === 'message' && value && value.length < 10) {
      isValid = false;
      errorMessage = 'A mensagem deve ter pelo menos 10 caracteres';
    }

    if (!isValid) {
      this.showFieldError(input, errorMessage);
    } else if (value) {
      input.classList.add('valid');
      input.classList.remove('error');
    }

    return isValid;
  }

  private showFieldError(input: HTMLInputElement | HTMLTextAreaElement, message: string): void {
    input.classList.add('error');
    input.classList.remove('valid', 'typing');
    
    const existingError = input.parentElement?.querySelector('.error-message');
    if (existingError) existingError.remove();

    const errorDiv = document.createElement('p');
    errorDiv.className = 'error-message text-red-500 text-sm mt-1 flex items-center gap-1';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle text-xs"></i> ${message}`;
    input.parentElement?.appendChild(errorDiv);
  }

  private clearFieldError(input: HTMLInputElement | HTMLTextAreaElement): void {
    input.classList.remove('error');
    const existingError = input.parentElement?.querySelector('.error-message');
    if (existingError) existingError.remove();
  }

  private setLoadingState(loading: boolean): void {
    if (!this.submitBtn) return;

    if (loading) {
      this.submitBtn.disabled = true;
      this.submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Enviando...
      `;
      this.submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
    } else {
      this.submitBtn.disabled = false;
      this.submitBtn.innerHTML = this.originalBtnText;
      this.submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
  }

  private showStatus(type: 'success' | 'error', message: string): void {
    if (!this.statusDiv) return;

    this.statusDiv.className = 'text-center py-3 px-4 rounded-lg mt-4 flex items-center justify-center gap-2';
    
    if (type === 'success') {
      this.statusDiv.classList.add('bg-green-100', 'dark:bg-green-900/30', 'text-green-700', 'dark:text-green-400');
    } else {
      this.statusDiv.classList.add('bg-red-100', 'dark:bg-red-900/30', 'text-red-700', 'dark:text-red-400');
    }
    
    this.statusDiv.textContent = message;
    this.statusDiv.classList.remove('hidden');

    if (type === 'success') {
      setTimeout(() => {
        this.statusDiv?.classList.add('hidden');
      }, 5000);
    }
  }
}
