document.addEventListener('DOMContentLoaded', () => {
  const selectors = {
    sections: '.fade-in',
    header: 'header',
    interactive: '.call-to-action, .badge, .project-card, .education-item',
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
    debounceDelay: 100,
    themeKey: 'themePreference',
  };

  // WeakMap para guardar listeners e evitar poluir DOM
  const interactiveListeners = new WeakMap();

  const applyTheme = (theme) => {
    try {
      document.body.classList.toggle('dark', theme === 'dark');

      elements.themeIcon.classList.toggle('fa-moon', theme === 'light');
      elements.themeIcon.classList.toggle('fa-sun', theme === 'dark');

      elements.themeToggle.setAttribute(
        'aria-label',
        `Alternar modo ${theme === 'light' ? 'escuro' : 'claro'}`
      );

      localStorage.setItem(config.themeKey, theme);
    } catch (error) {
      console.error('Erro ao aplicar tema:', error);
    }
  };

  const toggleTheme = () => {
    const currentTheme = localStorage.getItem(config.themeKey) || 'light';
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
    try {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach(({ target, isIntersecting }) => {
            if (isIntersecting) {
              target.classList.add('opacity-100', 'translate-y-0');
              obs.unobserve(target);
            }
          });
        },
        {
          threshold: config.observerThreshold,
          rootMargin: '50px',
        }
      );

      elements.sections.forEach((section) => {
        section.classList.add('opacity-0', 'translate-y-4');
        observer.observe(section);
      });

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
      element.setAttribute('aria-interactive', 'true');

      const onHover = () => {
        element.classList.add('scale-105');
        element.setAttribute('aria-expanded', 'true');
      };

      const onLeave = () => {
        element.classList.remove('scale-105');
        element.setAttribute('aria-expanded', 'false');
      };

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

  const init = () => {
    if (!elements.header) console.warn('Elemento de cabeçalho não encontrado');
    if (!elements.themeToggle) console.warn('Botão de alternar tema não encontrado');

    loadTheme();

    const observer = setupObserver();

    elements.interactive.forEach(addInteractiveEffects);

    const debouncedUpdateHeader = debounce(updateHeader, config.debounceDelay);
    window.addEventListener('scroll', debouncedUpdateHeader, { passive: true });

    if (elements.themeToggle) {
      elements.themeToggle.addEventListener('click', toggleTheme);

      const keypressHandler = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTheme();
        }
      };

      elements.themeToggle.addEventListener('keypress', keypressHandler);

      // Cleanup no unload
      window.addEventListener('unload', () => {
        if (observer) observer.disconnect();
        window.removeEventListener('scroll', debouncedUpdateHeader);

        elements.interactive.forEach(removeInteractiveEffects);

        elements.themeToggle.removeEventListener('click', toggleTheme);
        elements.themeToggle.removeEventListener('keypress', keypressHandler);
      });
    }

    updateHeader();
  };

  init();
});
