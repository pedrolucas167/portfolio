document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('.fade-in');
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
    revealSection(); // Para ativar a verificação inicial

    // Adiciona efeito suave ao header ao rolar a página
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Animação de botões ao passar o mouse
    const buttons = document.querySelectorAll('.hero button, .call-to-action');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
    });
});
