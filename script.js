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
  const aboutSection = $('.about-section');
  const techStackSection = $('.tech-stack-section');

  const forceVisible = (el) => {
    if (!el) return;
    Object.assign(el.style, {
      opacity: '1',
      visibility: 'visible',
      transform: 'none',
      zIndex: '20'
    });
  };

  const fixHiddenSections = () => {
    forceVisible(aboutSection);
    forceVisible(techStackSection);

    $('.about-container')?.style.setProperty('z-index', '10');
    $('.tech-stack-container')?.style.setProperty('z-index', '10');
  };

  const adjustLayout = () => {
    if (window.innerWidth < 768 && header && mainContent) {
      mainContent.style.paddingTop = `${header.offsetHeight + 20}px`;
    } else {
      mainContent.style.paddingTop = '';
    }

    if (heroSection && header) {
      heroSection.style.minHeight = `${window.innerHeight - header.offsetHeight}px`;
    }

    aboutSection && (aboutSection.style.minHeight = 'auto');
    techStackSection && (techStackSection.style.minHeight = 'auto');
  };

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
    Object.assign(section.style, {
      opacity: '1',
      visibility: 'visible',
      transform: 'none',
      transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
    });
    observer.observe(section);
  });

  const handleHeaderScroll = () => {
    if (header) {
      const isScrolled = window.scrollY > 50;
      header.classList.toggle('scrolled', isScrolled);
      header.style.boxShadow = isScrolled ? '0 4px 12px rgba(0, 0, 0, 0.1)' : '';
    }
    aboutSection && checkVisibility(aboutSection);
    techStackSection && checkVisibility(techStackSection);
  };

  const checkVisibility = (el) => {
    const rect = el.getBoundingClientRect();
    const visible = rect.top <= window.innerHeight * 0.75 && rect.bottom >= 0;
    if (visible) forceVisible(el);
  };

  if (typingElement) {
    const phrases = [
      'Engenheiro de Software.',
      'Especialista em Nuvem.',
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

      if (heroSection) {
        heroSection.style.backgroundColor = theme === 'dark' ? '#0f172a' : '';
      }

      [aboutSection, techStackSection].forEach(el => {
        if (el) {
          el.style.display = 'none';
          setTimeout(() => el.style.display = '', 10);
        }
      });
    };

    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });

    const saved = localStorage.getItem('theme');
    if (saved) applyTheme(saved);
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

  fixHiddenSections();
  adjustLayout();
  handleHeaderScroll();

  setTimeout(() => {
    aboutSection && checkVisibility(aboutSection);
    techStackSection && checkVisibility(techStackSection);
  }, 500);

  window.addEventListener('scroll', handleHeaderScroll);
  window.addEventListener('resize', adjustLayout);
});
