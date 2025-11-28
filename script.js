document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  // Elementos principais
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
    const sections = ['.about-section', '.tech-stack-section', '.contact-section']
      .map(selector => $(selector))
      .filter(section => section);

    sections.forEach(section => forceVisible(section));
  };

  // Ajustar layout responsivo
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

  // Observer para animações
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

  fadeInSections.forEach(section => observer.observe(section));

  setTimeout(fixHiddenSections, 1000);

  const handleHeaderScroll = () => {
    if (header) {
      const isScrolled = window.scrollY > 50;
      header.classList.toggle('scrolled', isScrolled);
      header.style.boxShadow = isScrolled ? '0 4px 12px rgba(0, 0, 0, 0.1)' : '';
    }
  };

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

  if (themeToggle && themeIcon) {
    const applyTheme = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      themeIcon.className = `fas fa-${theme === 'dark' ? 'sun' : 'moon'}`;
      localStorage.setItem('theme', theme);
      
      // Ajuste adicional para o hero section
      if (heroSection) {
        heroSection.style.backgroundColor = theme === 'dark' ? '#0f172a' : '';
      }
      
      fixHiddenSections();
    };

    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    // Aplicar tema salvo ou padrão
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
  }

  if (mobileMenuToggle && primaryNav) {
    mobileMenuToggle.addEventListener('click', () => {
      const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
      primaryNav.classList.toggle('open');
      mobileMenuToggle.querySelector('i').className = `fas fa-${isExpanded ? 'bars' : 'times'}`;
    });

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

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  adjustLayout();
  handleHeaderScroll();

  // Event listeners
  window.addEventListener('scroll', handleHeaderScroll);
  window.addEventListener('resize', debounce(adjustLayout, 100));
});