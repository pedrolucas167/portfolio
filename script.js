document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Seletores de Elementos ---
    const header = document.querySelector('.main-header');
    const mainContent = document.querySelector('main');
    const fadeInSections = document.querySelectorAll('.fade-in');
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle?.querySelector('i');
    const typingElement = document.querySelector('.typing-text');
    const heroSection = document.querySelector('.hero-section');
    const aboutSection = document.querySelector('.about-section');
    const techStackSection = document.querySelector('.tech-stack-section');

    // --- 2. Solução para Seções Escondidas ---
    const fixHiddenSections = () => {
        // Forçar exibição das seções problemáticas
        if (aboutSection) {
            aboutSection.style.opacity = '1';
            aboutSection.style.visibility = 'visible';
            aboutSection.style.transform = 'none';
            aboutSection.style.zIndex = '20';
        }

        if (techStackSection) {
            techStackSection.style.opacity = '1';
            techStackSection.style.visibility = 'visible';
            techStackSection.style.transform = 'none';
            techStackSection.style.zIndex = '20';
        }

        // Corrigir z-index dos containers
        const aboutContainer = document.querySelector('.about-container');
        const techStackContainer = document.querySelector('.tech-stack-container');
        
        if (aboutContainer) aboutContainer.style.zIndex = '10';
        if (techStackContainer) techStackContainer.style.zIndex = '10';
    };

    // --- 3. Solução para Telas Sobrepostas ---
    const adjustLayout = () => {
        // Ajusta o padding do main para o header fixo
        if (window.innerWidth < 768) {
            const headerHeight = header.offsetHeight;
            mainContent.style.paddingTop = `${headerHeight + 20}px`;
        } else {
            mainContent.style.paddingTop = '';
        }

        // Ajusta a altura mínima da hero section
        if (heroSection) {
            const viewportHeight = window.innerHeight;
            const headerHeight = header.offsetHeight;
            heroSection.style.minHeight = `${viewportHeight - headerHeight}px`;
        }

        // Garantir que as seções tenham altura adequada
        if (aboutSection) aboutSection.style.minHeight = 'auto';
        if (techStackSection) techStackSection.style.minHeight = 'auto';
    };

    // --- 4. Animação "Fade In" com Intersection Observer Modificado ---
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.visibility = 'visible';
                entry.target.style.transform = 'none';
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1, // Threshold mais sensível
        rootMargin: '0px 0px -50px 0px' // Margem inferior para disparar antes
    });

    // Observar seções com configuração mais sensível
    fadeInSections.forEach(section => {
        // Forçar estilos iniciais
        section.style.opacity = '1';
        section.style.visibility = 'visible';
        section.style.transform = 'none';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        
        // Observar a seção
        sectionObserver.observe(section);
    });

    // --- 5. Efeito de Scroll no Header ---
    const handleHeaderScroll = () => {
        if (header) {
            const shouldScrolled = window.scrollY > 50;
            header.classList.toggle('scrolled', shouldScrolled);
            
            if (shouldScrolled) {
                header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '';
            }
        }

        // Verificar visibilidade das seções durante o scroll
        if (aboutSection) checkSectionVisibility(aboutSection);
        if (techStackSection) checkSectionVisibility(techStackSection);
    };

    // Função para verificar visibilidade das seções
    const checkSectionVisibility = (section) => {
        const rect = section.getBoundingClientRect();
        const isVisible = (
            rect.top <= window.innerHeight * 0.75 && 
            rect.bottom >= 0
        );
        
        if (isVisible) {
            section.style.opacity = '1';
            section.style.visibility = 'visible';
            section.style.transform = 'none';
        }
    };

    // --- 6. Animação de Digitação ---
    if (typingElement) {
        const typingPhrases = [
            'Engenheiro de Software.',
            'Especialista em Nuvem.',
            'Desenvolvedor Full-Stack.',
            'Apaixonado por Tecnologia.'
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const type = () => {
            const currentPhrase = typingPhrases[phraseIndex];
            const typingSpeed = 100;
            const deletingSpeed = 50;
            const pauseTime = 1500;

            typingElement.textContent = isDeleting 
                ? currentPhrase.substring(0, charIndex--) 
                : currentPhrase.substring(0, charIndex++);

            if (isDeleting && charIndex < 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % typingPhrases.length;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                setTimeout(type, pauseTime);
                return;
            }

            setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
        };
        
        type();
    }
    
    // --- 7. Alternador de Tema ---
    if (themeToggle && themeIcon) {
        const applyTheme = (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            themeIcon.className = `fas fa-${theme === 'dark' ? 'sun' : 'moon'}`;
            localStorage.setItem('theme', theme);
            
            if (theme === 'dark') {
                if (heroSection) heroSection.style.backgroundColor = '#0f172a';
            } else {
                if (heroSection) heroSection.style.backgroundColor = '';
            }

            // Forçar redesenho das seções após mudança de tema
            if (aboutSection) aboutSection.style.display = 'none';
            if (techStackSection) techStackSection.style.display = 'none';
            
            setTimeout(() => {
                if (aboutSection) aboutSection.style.display = '';
                if (techStackSection) techStackSection.style.display = '';
            }, 10);
        };

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            applyTheme(savedTheme);
        }
    }

    // --- 8. Inicialização do Particles.js ---
    if (typeof particlesJS !== 'undefined' && heroSection) {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#ffffff" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": true },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": false },
                "move": { "enable": true, "speed": 1.5, "direction": "none", "random": true, "straight": false, "out_mode": "out" }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": false } },
                "modes": { "repulse": { "distance": 100, "duration": 0.4 } }
            },
            "retina_detect": true
        });

        const particlesCanvas = document.querySelector('#particles-js canvas');
        if (particlesCanvas) {
            particlesCanvas.style.position = 'absolute';
            particlesCanvas.style.zIndex = '-1';
        }
    }

    // --- 9. Inicialização ---
    fixHiddenSections();
    adjustLayout();
    handleHeaderScroll();
    
    // Verificar seções novamente após um pequeno delay
    setTimeout(() => {
        if (aboutSection) checkSectionVisibility(aboutSection);
        if (techStackSection) checkSectionVisibility(techStackSection);
    }, 500);

    // Disparar evento de scroll inicial
    window.dispatchEvent(new Event('scroll'));
});