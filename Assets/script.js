document.addEventListener('DOMContentLoaded', () => {
  // --- Seletores, Elementos e Configurações (Estrutura excelente!) ---
  const selectors = {
    sections: 'section[id]', // Um pouco mais específico para seções animadas
    header: 'header',
    interactive: '.project-card, .education-item, .contact-icon',
    themeToggle: '.theme-toggle',
    themeIcon: '.theme-toggle i',
  };

  const elements = {
    sections: document.querySelectorAll(selectors.sections),
    header: document.querySelector(selectors.header),
    interactive: document.querySelectorAll(selectors.interactive),
    themeToggle: document.querySelector(selectors.themeToggle),
    themeIcon: document.querySelector(selectors.themeIcon),
  };

  const config = {
    observerThreshold: 0.1,
    scrollThreshold: 30,
    debounceDelay: 20, // Reduzido para uma resposta mais rápida da UI
    themeKey: 'themePreference',
  };

  // WeakMap para listeners continua sendo uma ótima escolha.
  const interactiveListeners = new WeakMap();

  // --- Funções ---

  const applyTheme = (theme) => {
    try {
      // PONTO 1: Usando o sistema data-theme para alinhar com o CSS customizado.
      document.documentElement.setAttribute('data-theme', theme);
      
      // A lógica de ícones e ARIA está perfeita.
      elements.themeIcon.classList.toggle('fa-moon', theme === 'light');
      elements.themeIcon.classList.toggle('fa-sun', theme === 'dark');
      elements.themeToggle.setAttribute('aria-label', `Alternar para modo ${theme === 'light' ? 'escuro' : 'claro'}`);
      
      localStorage.setItem(config.themeKey, theme);
    } catch (error) {
      console.error('Erro ao aplicar tema:', error);
    }
  };

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(currentTheme === 'light' ? 'dark' : 'light');
  };

  const loadTheme = () => {
    try {
      const savedTheme = localStorage.getItem(config.themeKey);
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
    }
  };

  const setupObserver = () => {
    if (!('IntersectionObserver' in window)) return null;
    try {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: config.observerThreshold }
      );
      elements.sections.forEach((section) => observer.observe(section));
      return observer;
    } catch (error) {
      console.error('Erro ao configurar observer:', error);
      return null;
    }
  };

  const updateHeader = () => {
    if (!elements.header) return;
    elements.header.classList.toggle('scrolled', window.scrollY > config.scrollThreshold);
  };

  const addInteractiveEffects = (element) => {
    try {
      const onHover = () => element.classList.add('is-hovered');
      const onLeave = () => element.classList.remove('is-hovered');

      element.addEventListener('mouseenter', onHover);
      element.addEventListener('mouseleave', onLeave);
      element.addEventListener('focus', onHover);
      element.addEventListener('blur', onLeave);

      interactiveListeners.set(element, { onHover, onLeave });
    } catch (error) {
      console.error('Erro ao aplicar efeitos interativos:', error);
    }
  };
  
  const removeInteractiveEffects = (element) => {
    const listeners = interactiveListeners.get(element);
    if (!listeners) return;
    element.removeEventListener('mouseenter', listeners.onHover);
    element.removeEventListener('mouseleave', listeners.onLeave);
    element.removeEventListener('focus', listeners.onHover);
    element.removeEventListener('blur', listeners.onLeave);
    interactiveListeners.delete(element);
  };

  const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  };

  // --- Inicialização ---

  const init = () => {
    if (!elements.themeToggle) console.warn('Botão de alternar tema não encontrado');

    loadTheme();
    const observer = setupObserver();
    elements.interactive.forEach(addInteractiveEffects);
    
    const debouncedUpdateHeader = debounce(updateHeader, config.debounceDelay);
    window.addEventListener('scroll', debouncedUpdateHeader, { passive: true });

    if (elements.themeToggle) {
      elements.themeToggle.addEventListener('click', toggleTheme);
    }
    
    // PONTO 3: Usando 'pagehide' em vez de 'unload' para limpeza.
    window.addEventListener('pagehide', () => {
      if (observer) observer.disconnect();
      window.removeEventListener('scroll', debouncedUpdateHeader);
      elements.interactive.forEach(removeInteractiveEffects);
      if (elements.themeToggle) {
        elements.themeToggle.removeEventListener('click', toggleTheme);
      }
    });

    updateHeader(); // Executa uma vez no load
  };

  init();
});