import content from '../../shared/portfolio/content.json';
import { FaJava, FaNodeJs, FaReact, FaDocker, FaGitAlt, FaGithub, FaLinkedin, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { SiTypescript, SiSpring, SiPostgresql } from 'react-icons/si';
import { IconType } from 'react-icons';

export const personalInfo = content.personalInfo;

export const socialLinks = { github: personalInfo.github, linkedin: personalInfo.linkedin, email: personalInfo.email };

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

const icons: Record<string, IconType> = { FaJava, SiSpring, FaNodeJs, FaReact, SiTypescript, FaDocker, SiPostgresql, FaGitAlt };
export const techStack: TechItem[] = content.techStack.map(item => ({ ...item, icon: icons[item.icon] }));

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

export const projects: Project[] = content.projects;

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

export const articles: Article[] = content.articles;

export const navLinks = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#tecnologias', label: 'Stack' },
  { href: '#contato', label: 'Contato' },
];