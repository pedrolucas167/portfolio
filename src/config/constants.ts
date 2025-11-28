import type { SocialLink, TechStack, TypingConfig, ParticlesConfig } from '@/types';

export const SITE_CONFIG = {
  name: 'Pedro Marques',
  title: 'Engenheiro de Software',
  subtitle: 'Full-Stack Developer',
  email: 'poloniosh@outlook.com.br',
  github: 'pedrolucas167',
  linkedin: 'pedrolucas167',
} as const;

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'Email',
    url: `mailto:${SITE_CONFIG.email}`,
    icon: 'fas fa-envelope',
    ariaLabel: 'Enviar email',
  },
  {
    name: 'LinkedIn',
    url: `https://linkedin.com/in/${SITE_CONFIG.linkedin}`,
    icon: 'fab fa-linkedin',
    ariaLabel: 'Perfil no LinkedIn',
  },
  {
    name: 'GitHub',
    url: `https://github.com/${SITE_CONFIG.github}`,
    icon: 'fab fa-github',
    ariaLabel: 'Perfil no GitHub',
  },
];

export const TECH_STACK: TechStack[] = [
  { name: 'Java', icon: 'fab fa-java', category: 'language' },
  { name: 'Spring Boot', icon: 'devicon-spring-plain colored', category: 'framework' },
  { name: 'Node.js', icon: 'fab fa-node-js', category: 'framework' },
  { name: 'React', icon: 'fab fa-react', category: 'framework' },
  { name: 'TypeScript', icon: 'devicon-typescript-plain colored', category: 'language' },
  { name: 'Docker', icon: 'fab fa-docker', category: 'tool' },
  { name: 'PostgreSQL', icon: 'devicon-postgresql-plain colored', category: 'database' },
  { name: 'Git', icon: 'fab fa-git-alt', category: 'tool' },
];

export const TYPING_CONFIG: TypingConfig = {
  phrases: [
    'Engenheiro de Software.',
    'Desenvolvedor Full-Stack.',
    'Apaixonado por Tecnologia.',
  ],
  typeSpeed: 100,
  deleteSpeed: 50,
  pauseTime: 1500,
};

export const PARTICLES_CONFIG: ParticlesConfig = {
  particles: {
    number: { value: 60, density: { enable: true, value_area: 800 } },
    color: { value: '#ffffff' },
    shape: { type: 'circle' },
    opacity: { value: 0.5, random: true },
    size: { value: 3, random: true },
    line_linked: { enable: false },
    move: { enable: true, speed: 1.5, random: true, out_mode: 'out' },
  },
  interactivity: {
    detect_on: 'canvas',
    events: { onhover: { enable: true, mode: 'repulse' } },
    modes: { repulse: { distance: 100, duration: 0.4 } },
  },
  retina_detect: true,
};

export const NAV_LINKS = [
  { href: '#about', label: 'Sobre' },
  { href: '#tech-stack', label: 'Stack' },
  { href: '#contact', label: 'Contato' },
] as const;
