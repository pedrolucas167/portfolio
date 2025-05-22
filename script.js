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
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: config.observerThreshold,
        rootMargin: '50px'
    });

    // Observa seções
    elements.sections.forEach(section => {
        section.style.transition = `opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)`;
        observer.observe(section);
    });

    // Efeito de scroll no header
    const updateHeader = () => {
        elements.header?.classList.toggle('scrolled', window.scrollY > config.scrollThreshold);
    };

    // Efeitos de interação
    const applyInteractiveEffects = (element) => {
        element.style.transition = `transform ${config.transitionDuration} ease, box-shadow ${config.transitionDuration} ease`;
        element.setAttribute('aria-interactive', 'true');

        const applyHover = () => {
            element.style.transform = 'scale(1.08) rotateZ(0.5deg)';
            element.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
            element.setAttribute('aria-expanded', 'true');
        };

        const removeHover = () => {
            element.style.transform = 'scale(1) rotateZ(0deg)';
            element.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
            element.setAttribute('aria-expanded', 'false');
        };

        element.addEventListener('mouseenter', applyHover);
        element.addEventListener('mouseleave', removeHover);
        element.addEventListener('focus', applyHover);
        element.addEventListener('blur', removeHover);

        // Movimento leve com o mouse (parallax tilt)
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            element.style.transform = `scale(1.05) rotateX(${y * 6}deg) rotateY(${x * 6}deg)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1) rotateX(0) rotateY(0)';
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

        window.addEventListener('scroll', debounce(updateHeader, config.debounceDelay), {
            passive: true
        });

        elements.interactive.forEach(applyInteractiveEffects);
        updateHeader();
    };

    init();

    // Cleanup
    window.addEventListener('unload', () => {
        observer.disconnect();
        window.removeEventListener('scroll', updateHeader);
    });
});
