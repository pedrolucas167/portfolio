document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Seletores de Elementos ---
    const header = document.querySelector('.main-header'); // Atualizado
    const fadeInSections = document.querySelectorAll('.fade-in');
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle?.querySelector('i');
    const typingElement = document.querySelector('.typing-text');

    // --- 2. Animação "Fade In" com Intersection Observer (Mais performático) ---
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Quando a seção estiver 15% visível na tela
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Opcional: para de observar o elemento após a animação para economizar recursos
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15 // A animação dispara quando 15% da seção está visível
    });

    // Observa cada uma das seções com a classe .fade-in
    fadeInSections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- 3. Efeito de Scroll no Header ---
    const handleHeaderScroll = () => {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }
    };
    
    // Adiciona o evento de scroll para o header de forma otimizada
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    // --- 4. Animação de Digitação ---
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

            // Define o texto atual baseado em estar digitando ou apagando
            typingElement.textContent = isDeleting 
                ? currentPhrase.substring(0, charIndex--) 
                : currentPhrase.substring(0, charIndex++);

            // Se terminou de apagar, muda para a próxima frase
            if (isDeleting && charIndex < 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % typingPhrases.length;
            }

            // Se terminou de digitar, inicia o processo de apagar
            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                setTimeout(type, pauseTime);
                return;
            }

            setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
        };
        
        type(); // Inicia a animação
    }
    
    // --- 5. Alternador de Tema ---
    if (themeToggle && themeIcon) {
        const applyTheme = (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            themeIcon.className = `fas fa-${theme === 'dark' ? 'sun' : 'moon'}`;
            localStorage.setItem('theme', theme); // Salva a preferência
        };

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });

        // Aplica o tema salvo ao carregar a página
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            applyTheme(savedTheme);
        }
    }

    // --- 6. Inicialização do Particles.js ---
    if (typeof particlesJS !== 'undefined') {
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
    }

    // Garante que o estado inicial do header está correto
    handleHeaderScroll();
});