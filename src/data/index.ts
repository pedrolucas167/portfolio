import { FaJava, FaNodeJs, FaReact, FaDocker, FaGitAlt, FaGithub, FaLinkedin, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { SiTypescript, SiSpring, SiPostgresql } from 'react-icons/si';
import { IconType } from 'react-icons';

export const personalInfo = {
  name: 'Pedro Lucas',
  role: 'hero_role',
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
  'hero_typing_text_1',
  'hero_typing_text_2',
  'hero_typing_text_3',
  'hero_typing_text_4',
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
    title: 'project_novamesh_title',
    description: 'project_novamesh_description',
    fullDescription: 'project_novamesh_full_description',
    technologies: ['React', 'TypeScript', 'Vite', 'Module Federation', 'Microfrontends'],
    category: 'project_novamesh_category',
    gradient: 'from-cyan-500 to-blue-600',
    github: 'https://github.com/pedrolucas167/novamesh',
    features: [
      'project_novamesh_feature_1',
      'project_novamesh_feature_2',
      'project_novamesh_feature_3',
      'project_novamesh_feature_4',
      'project_novamesh_feature_5',
    ],
  },
  {
    id: 4,
    title: 'project_inventory_title',
    description: 'project_inventory_description',
    fullDescription: 'project_inventory_full_description',
    technologies: ['Java', 'Spring Boot', 'React', 'PostgreSQL', 'Docker'],
    category: 'project_inventory_category',
    gradient: 'from-blue-500 to-indigo-600',
    github: 'https://github.com/pedrolucas167/sistema-estoque',
    features: [
      'project_inventory_feature_1',
      'project_inventory_feature_2',
      'project_inventory_feature_3',
      'project_inventory_feature_4',
      'project_inventory_feature_5',
    ],
  },
  {
    id: 3,
    title: 'project_messagelove_title',
    description: 'project_messagelove_description',
    fullDescription: 'project_messagelove_full_description',
    technologies: ['TypeScript', 'React', 'Node.js', 'Auth', 'Media Streaming'],
    category: 'project_messagelove_category',
    gradient: 'from-pink-500 to-rose-600',
    github: 'https://github.com/pedrolucas167/messagelove',
    demo: 'https://messagelove.com.br',
    features: [
      'project_messagelove_feature_1',
      'project_messagelove_feature_2',
      'project_messagelove_feature_3',
      'project_messagelove_feature_4',
      'project_messagelove_feature_5',
    ],
  },
  {
    id: 2,
    title: 'project_toy_data_title',
    description: 'project_toy_data_description',
    fullDescription: 'project_toy_data_full_description',
    technologies: ['Python', 'Docker', 'Data Processing', 'Visualization', 'Pandas'],
    category: 'project_toy_data_category',
    gradient: 'from-emerald-500 to-teal-600',
    github: 'https://github.com/pedrolucas167/toy-data-platform',
    features: [
      'project_toy_data_feature_1',
      'project_toy_data_feature_2',
      'project_toy_data_feature_3',
      'project_toy_data_feature_4',
      'project_toy_data_feature_5',
    ],
  },
];

export const contactLinks = [
  {
    name: 'Email',
    href: `mailto:${personalInfo.email}`,
    icon: FaEnvelope,
    label: 'contact_link_email_label',
    value: personalInfo.email,
    color: 'from-[var(--color-accent)] to-emerald-500',
  },
  {
    name: 'GitHub',
    href: personalInfo.github,
    icon: FaGithub,
    label: 'contact_link_github_label',
    value: '@pedrolucas167',
    color: 'from-gray-600 to-gray-800',
  },
  {
    name: 'LinkedIn',
    href: personalInfo.linkedin,
    icon: FaLinkedin,
    label: 'contact_link_linkedin_label',
    value: 'in/pedromarquesdev',
    color: 'from-blue-500 to-blue-700',
  },
  {
    name: 'Location',
    href: null,
    icon: FaMapMarkerAlt,
    label: 'contact_link_location_label',
    value: 'contact_link_location_value',
    color: 'from-[var(--color-secondary)] to-purple-700',
  },
];

export interface Article {
  id: number;
  titleKey: string;
  descriptionKey: string;
  url: string;
  tag: string;
  gradient: string;
  emoji: string;
  readingTime: string;
}

export const articles: Article[] = [
  {
    id: 1,
    titleKey: 'article_rag_title',
    descriptionKey: 'article_rag_description',
    url: 'https://medium.com/@preluramos/por-que-as-ias-mentem-com-tanta-confian%C3%A7a-e-como-a-arquitetura-rag-resolve-isso-868c6b7edb66',
    tag: 'IA & RAG',
    gradient: 'from-violet-500 to-purple-600',
    emoji: '🤖',
    readingTime: '8 min',
  },
  {
    id: 2,
    titleKey: 'article_spring_projection_title',
    descriptionKey: 'article_spring_projection_description',
    url: 'https://medium.com/@preluramos/otimizando-performance-com-spring-data-projection-836e1c7077da',
    tag: 'Java & Spring',
    gradient: 'from-green-500 to-emerald-600',
    emoji: '⚡',
    readingTime: '6 min',
  },
  {
    id: 3,
    titleKey: 'article_dune_title',
    descriptionKey: 'article_dune_description',
    url: 'https://medium.com/@preluramos/e-se-duna-n%C3%A3o-fosse-fic%C3%A7%C3%A3o-b8a519678659',
    tag: 'Ficção & Tech',
    gradient: 'from-amber-500 to-orange-600',
    emoji: '🏜️',
    readingTime: '5 min',
  },
  {
    id: 4,
    titleKey: 'article_argonauts_title',
    descriptionKey: 'article_argonauts_description',
    url: 'https://medium.com/@preluramos/the-argonauts-of-ai-exploring-the-new-frontier-of-intelligence-140b68fb0aff',
    tag: 'AI & Philosophy',
    gradient: 'from-cyan-500 to-blue-600',
    emoji: '🚀',
    readingTime: '7 min',
  },
];

export const navLinks = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#tecnologias', label: 'Stack' },
  { href: '#contato', label: 'Contato' },
];