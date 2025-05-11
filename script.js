document.addEventListener('DOMContentLoaded', () => {
    // Seletores
    const selectors = {
        sections: '.fade-in',
        header: 'header',
        interactive: '.call-to-action, .badge'
    };

    const elements = {
        sections: document.querySelectorAll(selectors.sections),
        header: document.querySelector(selectors.header),
        interactive: document.querySelectorAll(selectors.interactive)
    };

    // Configurações
    const config = {
        observerThreshold: 0.1,
        scrollThreshold: 30,
        debounceDelay: 100,
        transitionDuration: '0.3s'
    };

    // IntersectionObserver para fade-in
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Otimização: para de observar após animação
            }
        });
    }, {
        threshold: config.observerThreshold,
        rootMargin: '50px' // Carrega um pouco antes de entrar na viewport
    });

    // Observa seções
    elements.sections.forEach(section => {
        section.style.transition = `opacity 0.6s ease-out, transform 0.6s ease-out`;
        observer.observe(section);
    });

    // Efeito de scroll no header
    const updateHeader = () => {
        elements.header?.classList.toggle('scrolled', window.scrollY > config.scrollThreshold);
    };

    // Efeitos de interação
    const applyInteractiveEffects = (element) => {
        element.style.transition = `transform ${config.transitionDuration} ease-out`;
        element.setAttribute('aria-interactive', 'true');

        element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.05)'; // Escala reduzida para melhor UX
            element.setAttribute('aria-expanded', 'true');
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1)';
            element.setAttribute('aria-expanded', 'false');
        });

        // Suporte a teclado para acessibilidade
        element.addEventListener('focus', () => {
            element.style.transform = 'scale(1.05)';
        });

        element.addEventListener('blur', () => {
            element.style.transform = 'scale(1)';
        });
    };

    // Debounce para scroll
    const debounce = (callback, delay) => {
        let timeout;
        return () => {
            clearTimeout(timeout);
            timeout = setTimeout(callback, delay);
        };
    };

    // Inicialização
    const init = () => {
        if (!elements.header) {
            console.warn('Header element not found');
            return;
        }

        // Configura eventos
        window.addEventListener('scroll', debounce(updateHeader, config.debounceDelay), {
            passive: true // Melhora performance de scroll
        });

        elements.interactive.forEach(applyInteractiveEffects);
        updateHeader(); // Estado inicial do header
    };

    // Executa inicialização
    init();

    // Cleanup ao descarregar página
    window.addEventListener('unload', () => {
        observer.disconnect();
        window.removeEventListener('scroll', updateHeader);
    });
});