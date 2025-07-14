document.addEventListener('DOMContentLoaded', () => {
  // Alternar tema
  const themeToggle = document.querySelector('.theme-toggle');
  const html = document.documentElement;
  themeToggle.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeToggle.innerHTML = `<i class="fas fa-${isDark ? 'moon' : 'sun'}"></i>`;
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  });

  // Carregar tema salvo
  if (localStorage.getItem('theme') === 'dark') {
    html.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  // Animação de fade-in
  const faders = document.querySelectorAll('.fade-in');
  const appearOptions = { threshold: 0.2 };
  const appearOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        appearOnScroll.unobserve(entry.target);
      }
    });
  }, appearOptions);
  faders.forEach(fader => appearOnScroll.observe(fader));

  // Rastrear cliques no GitHub
  document.querySelectorAll('.github-link[href*="messagelove"]').forEach(link => {
    link.addEventListener('click', () => {
      gtag('event', 'click_messagelove_github', {
        'event_category': 'GitHub Links',
        'event_label': 'Messagelove Repository'
      });
    });
  });
});