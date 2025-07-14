document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Seletores de Elementos ---
    const header = document.querySelector('.main-header');
    const mainContent = document.querySelector('main');
    const fadeInSections = document.querySelectorAll('.fade-in');
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle?.querySelector('i');
    const typingElement = document.querySelector('.typing-text');
    const heroSection = document.querySelector('.hero-section');

    // --- 2. Solução para Telas Sobrepostas ---
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
    };

    // Executa no carregamento e no redimensionamento
    window.addEventListener('load', adjustLayout);
    window.addEventListener('resize', adjustLayout);

    // --- 3. Animação "Fade In" com Intersection Observer ---
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    fadeInSections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- 4. Efeito de Scroll no Header ---
    const handleHeaderScroll = () => {
        if (header) {
            const shouldScrolled = window.scrollY > 50;
            header.classList.toggle('scrolled', shouldScrolled);
            
            // Ajuste adicional para evitar sobreposição
            if (shouldScrolled) {
                header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '';
            }
        }
    };
    
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    // --- 5. Animação de Digitação ---
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
    
    // --- 6. Alternador de Tema ---
    if (themeToggle && themeIcon) {
        const applyTheme = (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            themeIcon.className = `fas fa-${theme === 'dark' ? 'sun' : 'moon'}`;
            localStorage.setItem('theme', theme);
            
            // Ajuste para garantir visibilidade no tema escuro
            if (theme === 'dark') {
                heroSection.style.backgroundColor = '#0f172a';
            } else {
                heroSection.style.backgroundColor = '';
            }
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

    // --- 7. Inicialização do Particles.js com ajustes de camada ---
    if (typeof particlesJS !== 'undefined' && heroSection) {
        particlesJS('particles-js', {
            "particles": {
                "number": { 
                    "value": 60, 
                    "density": { 
                        "enable": true, 
                        "value_area": 800 
                    } 
                },
                "color": { "value": "#ffffff" },
                "shape": { "type": "circle" },
                "opacity": { 
                    "value": 0.5, 
                    "random": true 
                },
                "size": { 
                    "value": 3, 
                    "random": true 
                },
                "line_linked": { 
                    "enable": false 
                },
                "move": { 
                    "enable": true, 
                    "speed": 1.5, 
                    "direction": "none", 
                    "random": true, 
                    "straight": false, 
                    "out_mode": "out" 
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { 
                    "onhover": { 
                        "enable": true, 
                        "mode": "repulse" 
                    }, 
                    "onclick": { 
                        "enable": false 
                    } 
                },
                "modes": { 
                    "repulse": { 
                        "distance": 100, 
                        "duration": 0.4 
                    } 
                }
            },
            "retina_detect": true
        });

        // Garante que o particles-js fique atrás do conteúdo
        const particlesCanvas = document.querySelector('#particles-js canvas');
        if (particlesCanvas) {
            particlesCanvas.style.position = 'absolute';
            particlesCanvas.style.zIndex = '-1';
        }
    }

    // Inicializa os ajustes de layout
    adjustLayout();
    handleHeaderScroll();
});