document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('.fade-in');
    const header = document.querySelector('header');
    const interactiveElements = document.querySelectorAll('.call-to-action, .badge');
    
    // Otimização com IntersectionObserver para o efeito de fade
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 }); // 10% da seção visível para acionar

    sections.forEach(section => observer.observe(section));

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

    // Debounce para scroll
    let debounceTimeout;
    const handleScroll = () => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
        debounceTimeout = setTimeout(() => {
            handleHeaderScroll();
        }, 100);
    };

    // Adicionando os ouvintes de eventos
    window.addEventListener('scroll', handleScroll);
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => handleMouseEnter(element));
        element.addEventListener('mouseleave', () => handleMouseLeave(element));
    });

    handleHeaderScroll();
});
