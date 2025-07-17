document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  const header = $('.main-header');
  const mainContent = $('main');
  const fadeInSections = $$('.fade-in');
  const themeToggle = $('.theme-toggle');
  const themeIcon = themeToggle?.querySelector('i');
  const typingElement = $('.typing-text');
  const heroSection = $('.hero-section');
  const mobileMenuToggle = $('.mobile-menu-toggle');
  const primaryNav = $('#primary-navigation');

  // Atualizar ano no footer
  $('#current-year').textContent = new Date().getFullYear();

  // Função para forçar visibilidade
  const forceVisible = (el) => {
    if (!el) return;
    el.classList.add('visible');
    Object.assign(el.style, {
      opacity: '1',
      visibility: 'visible',
      transform: 'none'
    });
  };

  // Corrigir seções ocultas
  const fixHiddenSections = () => {
    const aboutSection = $('.about-section');
    const techStackSection = $('.tech-stack-section');
    const contactSection = $('.contact-section');
    const aboutContainer = $('.about-container');
    const techStackContainer = $('.tech-stack-container');

    [aboutSection, techStackSection, contactSection].forEach(section => {
      if (section) forceVisible(section);
    });
    if (aboutContainer) aboutContainer.style.setProperty('z-index', '10');
    if (techStackContainer) techStackContainer.style.setProperty('z-index', '10');
  };

  // Ajustar layout
  const adjustLayout = () => {
    if (window.innerWidth < 768 && header && mainContent) {
      mainContent.style.paddingTop = `${header.offsetHeight + 20}px`;
    } else {
      mainContent.style.paddingTop = '';
    }

    if (heroSection && header) {
      heroSection.style.minHeight = `${window.innerHeight - header.offsetHeight}px`;
    }
  };

  // Intersection Observer para animações
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        forceVisible(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  fadeInSections.forEach(section => {
    observer.observe(section);
  });

  // Forçar visibilidade após 1s como fallback
  setTimeout(fixHiddenSections, 1000);

  // Manipular scroll do header
  const handleHeaderScroll = () => {
    if (header) {
      const isScrolled = window.scrollY > 50;
      header.classList.toggle('scrolled', isScrolled);
      header.style.boxShadow = isScrolled ? '0 4px 12px rgba(0, 0, 0, 0.1)' : '';
    }
  };

  // Efeito de digitação
  if (typingElement) {
    const phrases = [
      'Engenheiro de Software.',
      'Desenvolvedor Full-Stack.',
      'Apaixonado por Tecnologia.'
    ];
    let p = 0, c = 0, del = false;

    const type = () => {
      const phrase = phrases[p];
      typingElement.textContent = del ? phrase.substring(0, c--) : phrase.substring(0, c++);

      if (!del && c === phrase.length) {
        del = true;
        setTimeout(type, 1500);
        return;
      }

      if (del && c < 0) {
        del = false;
        p = (p + 1) % phrases.length;
      }

      setTimeout(type, del ? 50 : 100);
    };

    type();
  }

  // Função para aplicar filtro aos ícones Devicon
  const applyIconFilter = (theme) => {
    const devIcons = $$('.tech-badge i[class^="devicon-"]');
    devIcons.forEach(icon => {
      // Remove qualquer filtro existente
      icon.style.filter = '';
      
      // Aplica filtro apenas no tema escuro
      if (theme === 'dark') {
        // Filtro para inverter cores e ajustar brilho
        icon.style.filter = 'invert(1) brightness(1.5)';
      }
    });
  };

  // Alternar tema
  if (themeToggle && themeIcon) {
    const applyTheme = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      themeIcon.className = `fas fa-${theme === 'dark' ? 'sun' : 'moon'}`;
      localStorage.setItem('theme', theme);

      // Aplicar filtro aos ícones Devicon
      applyIconFilter(theme);

      // Ajustar cor de fundo da seção hero
      if (heroSection) {
        heroSection.style.backgroundColor = theme === 'dark' ? '#0f172a' : '';
      }

      // Garantir que seções estejam visíveis após mudança de tema
      fixHiddenSections();
    };

    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });

    // Aplicar tema salvo ou padrão
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
  }

  // Menu mobile
  if (mobileMenuToggle && primaryNav) {
    mobileMenuToggle.addEventListener('click', () => {
      const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
      primaryNav.classList.toggle('open');
      mobileMenuToggle.querySelector('i').className = `fas fa-${isExpanded ? 'bars' : 'times'}`;
    });

    // Fechar menu ao clicar em um link
    $$('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (primaryNav.classList.contains('open')) {
          primaryNav.classList.remove('open');
          mobileMenuToggle.setAttribute('aria-expanded', 'false');
          mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
        }
      });
    });
  }

  // Configuração do Particles.js
  if (typeof particlesJS !== 'undefined' && heroSection) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 60, density: { enable: true, value_area: 800 } },
        color: { value: '#ffffff' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: false },
        move: { enable: true, speed: 1.5, random: true, out_mode: 'out' }
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'repulse' } },
        modes: { repulse: { distance: 100, duration: 0.4 } }
      },
      retina_detect: true
    });

    const canvas = $('#particles-js canvas');
    if (canvas) canvas.style.zIndex = '-1';
  }

  // Debounce para eventos de resize
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  fixHiddenSections();
  adjustLayout();
  handleHeaderScroll();

  window.addEventListener('scroll', handleHeaderScroll);
  window.addEventListener('resize', debounce(adjustLayout, 100));
});