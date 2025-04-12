document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('.fade-in');
    const header = document.querySelector('header');
    const interactiveElements = document.querySelectorAll('.call-to-action, .badge');
    

    const revealSection = () => {
        const scrollY = window.pageYOffset;
        sections.forEach(section => {
            const sectionTop = section.offsetTop - window.innerHeight / 1.3;
            if (scrollY > sectionTop) {
                section.classList.add('visible');
            }
        });
    };

    // Função para o efeito de scroll no header
    const handleHeaderScroll = () => {
        if (window.scrollY > 30) { 
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    // Função para o efeito de escala ao passar o mouse
    const handleMouseEnter = (element) => {
        element.style.transform = 'scale(1.1)';
    };

    const handleMouseLeave = (element) => {
        element.style.transform = 'scale(1)';
    };

    
    window.addEventListener('scroll', () => {
        revealSection();
        handleHeaderScroll();
    });
    revealSection(); // Chama imediatamente para aplicar efeito nas seções ao carregar a página

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => handleMouseEnter(element));
        element.addEventListener('mouseleave', () => handleMouseLeave(element));
    });

    // Otimização de scroll com debounce
    let debounceTimeout;
    window.addEventListener('scroll', () => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
        debounceTimeout = setTimeout(() => {
            revealSection();
            handleHeaderScroll();
        }, 100); 
    });
});
