import { FaGithub, FaLinkedin, FaHeart } from 'react-icons/fa';
import { socialLinks } from '../../data';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-dark-card border-t border-gray-100 dark:border-dark-border">
      <div className="container mx-auto px-4 max-w-6xl py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Copyright */}
          <div className="text-center md:text-left">
            <a
              href="#inicio"
              className="text-xl font-bold text-gray-900 dark:text-white hover:text-accent transition-colors"
            >
              PL<span className="text-accent">.</span>
            </a>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              © {currentYear} Pedro Lucas. Todos os direitos reservados.
            </p>
          </div>

          {/* Made with love */}
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            Feito com <FaHeart className="text-red-500 animate-pulse" /> e muito café
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-accent transition-colors"
              aria-label="GitHub"
            >
              <FaGithub className="w-5 h-5" />
            </a>
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-accent transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
