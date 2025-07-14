document.addEventListener('DOMContentLoaded', () => {
    // Constants for DOM elements
    const sections = document.querySelectorAll('.fade-in');
    const header = document.querySelector('header');
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle?.querySelector('i');
    const typingElement = document.querySelector('.typing-text');

    // Throttle function for scroll events
    const throttle = (func, limit) => {
        let lastFunc;
        let lastRan;
        return (...args) => {
            if (!lastRan) {
                func(...args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(() => {
                    if ((Date.now() - lastRan) >= limit) {
                        func(...args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    };

    // Fade-in animation for sections
    const revealSections = () => {
        const windowHeight = window.innerHeight;
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < windowHeight * 0.85 && !section.classList.contains('visible')) {
                section.classList.add('visible');
            }
        });
    };

    // Header scroll effect
    const handleHeaderScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    };

    // Typing animation
    const typingPhrases = [
        'Engenheiro de Software',
        'Especialista em Nuvem',
        'Desenvolvedor Full-Stack',
        'Apaixonado por Tecnologia'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseTime = 1500;

    const type = () => {
        if (!typingElement) return;

        const currentPhrase = typingPhrases[phraseIndex];
        typingElement.textContent = currentPhrase.slice(0, charIndex);

        if (!isDeleting) {
            if (charIndex < currentPhrase.length) {
                charIndex++;
                setTimeout(type, typingSpeed);
            } else {
                isDeleting = true;
                setTimeout(type, pauseTime);
            }
        } else {
            if (charIndex > 0) {
                charIndex--;
                setTimeout(type, deletingSpeed);
            } else {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % typingPhrases.length;
                setTimeout(type, typingSpeed);
            }
        }
    };

    // Initialize particles.js
    if (window.particlesJS) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 50, density: { enable: true, value_area: 800 } },
                color: { value: '#ffffff' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: { enable: false },
                move: { enable: true, speed: 1, direction: 'none', random: true }
            },
            interactivity: {
                detect_on: 'canvas',
                events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } },
                modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
            },
            retina_detect: true
        });
    }

    // Initialize scroll handlers
    const throttledReveal = throttle(revealSections, 100);
    const throttledHeaderScroll = throttle(handleHeaderScroll, 100);
    window.addEventListener('scroll', () => {
        throttledReveal();
        throttledHeaderScroll();
    });
    revealSections();
    handleHeaderScroll();

    // Start typing animation
    if (typingElement) type();

    // Theme toggle
    if (themeToggle && themeIcon) {
        themeToggle.addEventListener('click', () => {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', newTheme);
            themeIcon.className = `fas fa-${newTheme === 'dark' ? 'sun' : 'moon'}`;
        });
    }
});