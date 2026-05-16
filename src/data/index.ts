import { FaJava, FaNodeJs, FaReact, FaDocker, FaGitAlt, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { SiTypescript, SiSpring, SiPostgresql } from 'react-icons/si';
import { IconType } from 'react-icons';

export const personalInfo = {
  name: 'Pedro Lucas',
  role: 'Full-Stack Engineer',
  email: 'pedro_marques_dev@hotmail.com',
  github: 'https://github.com/pedrolucas167',
  linkedin: 'https://linkedin.com/in/pedromarquesdev',
  location: 'Brasil',
};

export const socialLinks = {
  github: 'https://github.com/pedrolucas167',
  linkedin: 'https://linkedin.com/in/pedromarquesdev',
  email: 'pedro_marques_dev@hotmail.com',
};

export const typingTexts = [
  'Arquitetando soluções enterprise',
  'Desenvolvendo APIs de alta performance',
  'Transformando visões em realidade digital',
  'Criando experiências excepcionais',
];

export interface TechItem {
  name: string;
  icon: IconType;
  color?: string;
  level?: number;
}

export const techStack: TechItem[] = [
  { name: 'Java', icon: FaJava, color: '#f89820', level: 90 },
  { name: 'Spring Boot', icon: SiSpring, color: '#6db33f', level: 85 },
  { name: 'Node.js', icon: FaNodeJs, color: '#339933', level: 85 },
  { name: 'React', icon: FaReact, color: '#61dafb', level: 90 },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178c6', level: 88 },
  { name: 'Docker', icon: FaDocker, color: '#2496ed', level: 75 },
  { name: 'PostgreSQL', icon: SiPostgresql, color: '#336791', level: 80 },
  { name: 'Git', icon: FaGitAlt, color: '#f05032', level: 90 },
];

export interface Project {
  id: number;
  title: string;
  description: string;
  fullDescription?: string;
  technologies: string[];
  category: string;
  gradient: string;
  image?: string;
  github?: string;
  demo?: string;
  features?: string[];
}

export const projects: Project[] = [
  {
    id: 1,
    title: 'Novamesh',
    description: 'Arquitetura de microfrontends escalável para e-commerce enterprise com isolamento de domínios e deploy independente.',
    fullDescription: 'Portal corporativo desenvolvido com Module Federation, permitindo que múltiplos times trabalhem de forma autônoma sem dependências acopladas. Cada domínio de negócio evolui independentemente enquanto mantém a coesão visual e funcional da plataforma.',
    technologies: ['React', 'TypeScript', 'Vite', 'Module Federation', 'Microfrontends'],
    category: 'Architecture',
    gradient: 'from-cyan-500 to-blue-600',
    github: 'https://github.com/pedrolucas167/novamesh',
    features: [
      'Arquitetura de microfrontends escalável e resiliente',
      'Isolamento de domínios com independência de deploy',
      'Module Federation para carregamento dinâmico',
      'Stack moderno: React 18 + TypeScript + Vite',
      'Comunicação entre módulos via event bus',
    ],
  },
  {
    id: 4,
    title: 'Sistema de Inventário',
    description: 'Plataforma enterprise full-stack para gestão de inventário com backend robusto e interface moderna.',
    fullDescription: 'Solução corporativa construída com Spring Boot e React para controle centralizado de produtos, categorias e movimentações. Arquitetura preparada para escalabilidade e análise de dados, com APIs RESTful documentadas e pipeline otimizado para operações em massa.',
    technologies: ['Java', 'Spring Boot', 'React', 'PostgreSQL', 'Docker'],
    category: 'Full-Stack',
    gradient: 'from-blue-500 to-indigo-600',
    github: 'https://github.com/pedrolucas167/sistema-estoque',
    features: [
      'Gestão completa de inventário com rastreabilidade',
      'API RESTful com documentação Swagger',
      'Backend otimizado para operações em alta volume',
      'Dashboard com análises e relatórios',
      'Containerização completa com Docker',
    ],
  },
  {
    id: 3,
    title: 'Messagelove',
    description: 'Plataforma interativa para criar experiências memoráveis com mídia, áudio e autenticação segura.',
    fullDescription: 'Aplicação full-stack que combina tecnologia de ponta com design focado em experiência do usuário. Permite criar momentos personalizados integrando fotos, mensagens de voz, áudio e autenticação robusta em uma interface intuitiva e delightful.',
    technologies: ['TypeScript', 'React', 'Node.js', 'Auth', 'Media Streaming'],
    category: 'Full-Stack',
    gradient: 'from-pink-500 to-rose-600',
    github: 'https://github.com/pedrolucas167/messagelove',
    demo: 'https://messagelove.com.br',
    features: [
      'Integração seamless de mídia e áudio',
      'Autenticação segura e confiável',
      'Streaming otimizado de arquivos',
      'Interface responsiva e intuitiva',
      'Experiência mobile-first',
    ],
  },
  {
    id: 2,
    title: 'Toy Data Platform',
    description: 'Plataforma containerizada para experimentação, processamento e visualização de dados com reprodutibilidade.',
    fullDescription: 'Laboratório de dados completo e portável, desenvolvido com containerização para garantir que hoje e no futuro, experimentos, análises e pipelines executem de forma consistente. Ideal para prototipagem rápida e escalação para produção.',
    technologies: ['Python', 'Docker', 'Data Processing', 'Visualization', 'Pandas'],
    category: 'Data & DevOps',
    gradient: 'from-emerald-500 to-teal-600',
    github: 'https://github.com/pedrolucas167/toy-data-platform',
    features: [
      'Containerização completa com Docker Compose',
      'Pipeline de processamento de dados automatizado',
      'Visualizações interativas e em tempo real',
      'Ambiente isolado e reprodutível',
      'Prototipagem rápida para data science',
    ],
  },
];

export const contactLinks = [
  {
    name: 'Email',
    href: `mailto:${personalInfo.email}`,
    icon: FaEnvelope,
    label: personalInfo.email,
    color: 'primary',
  },
  {
    name: 'LinkedIn',
    href: personalInfo.linkedin,
    icon: FaLinkedin,
    label: '/in/pedrolucas167',
    color: 'blue',
  },
  {
    name: 'GitHub',
    href: personalInfo.github,
    icon: FaGithub,
    label: '@pedrolucas167',
    color: 'gray',
  },
];

export const navLinks = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#tecnologias', label: 'Stack' },
  { href: '#contato', label: 'Contato' },
];
