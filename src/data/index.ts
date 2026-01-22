import { FaJava, FaNodeJs, FaReact, FaDocker, FaGitAlt, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { SiTypescript, SiSpring, SiPostgresql } from 'react-icons/si';
import { IconType } from 'react-icons';

export const personalInfo = {
  name: 'Pedro Lucas',
  role: 'Desenvolvedor Full-Stack',
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
  'Desenvolvendo soluções escaláveis',
  'Arquitetando sistemas robustos',
  'Transformando ideias em código',
  'Criando experiências incríveis',
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
    title: 'MessageLove 💝',
    description: 'Plataforma para criar e compartilhar mensagens personalizadas para momentos especiais.',
    fullDescription: 'Uma aplicação full-stack moderna que permite criar mensagens personalizadas com temas românticos, animações e compartilhamento via link único.',
    technologies: ['Next.js', 'TypeScript', 'Node.js', 'AWS S3', 'PostgreSQL'],
    category: 'Full-Stack',
    gradient: 'from-pink-500 to-rose-600',
    github: 'https://github.com/pedrolucas167/messagelove',
    demo: 'https://messagelove.com.br',
    features: [
      'Criação de mensagens personalizadas',
      'Upload de imagens para AWS S3',
      'Links únicos para compartilhamento',
      'Temas e animações customizáveis',
      'Sistema de preview em tempo real',
    ],
  },
  {
    id: 2,
    title: 'Site Status Checker 🔍',
    description: 'Ferramenta CLI em Python para verificar o status de múltiplos sites simultaneamente.',
    fullDescription: 'Uma ferramenta de linha de comando eficiente para monitorar a disponibilidade de websites.',
    technologies: ['Python', 'Asyncio', 'Rich CLI', 'HTTP/HTTPS'],
    category: 'CLI Tool',
    gradient: 'from-green-500 to-emerald-600',
    github: 'https://github.com/pedrolucas167/site-status-checker',
    features: [
      'Verificação assíncrona de múltiplos sites',
      'Interface CLI colorida e intuitiva',
      'Relatórios de status detalhados',
      'Suporte a timeout configurável',
      'Export de resultados em JSON',
    ],
  },
  {
    id: 3,
    title: 'Sistema de Estoque 📦',
    description: 'Sistema completo para gerenciamento de estoque com React e Spring Boot.',
    fullDescription: 'Aplicação empresarial para controle de inventário com dashboard analytics e relatórios.',
    technologies: ['Java', 'Spring Boot', 'React', 'PostgreSQL', 'Docker'],
    category: 'Full-Stack',
    gradient: 'from-blue-500 to-indigo-600',
    github: 'https://github.com/pedrolucas167/sistema-estoque',
    features: [
      'CRUD completo de produtos',
      'Dashboard com analytics',
      'Controle de entrada/saída',
      'Relatórios em PDF',
      'API RESTful documentada',
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
