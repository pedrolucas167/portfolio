document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('.fade-in');
    
    // Função para revelar seções com efeito fade-in ao rolar
    const revealSection = () => {
        const scrollY = window.pageYOffset;
        sections.forEach(section => {
            const sectionTop = section.offsetTop - window.innerHeight / 1.3;
            if (scrollY > sectionTop) {
                section.classList.add('visible');
            }
        });
    };
    
    window.addEventListener('scroll', revealSection);
    revealSection(); // Verificação inicial ao carregar a página

    // Efeito suave no header ao rolar a página
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) { // Alterado de 50 para 30
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Animação de escala ao passar o mouse sobre elementos interativos
    const interactiveElements = document.querySelectorAll('.call-to-action, .badge');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.1)';
        });
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1)';
        });
    });
});