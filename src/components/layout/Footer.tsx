import { FaGithub, FaLinkedin, FaHeart, FaArrowUp } from 'react-icons/fa';
import { socialLinks } from '../../data';
import { useTranslation } from 'react-i18next'; // Import useTranslation

export function Footer() {
  const { t } = useTranslation(); // Initialize useTranslation
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/5">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-surface)] to-transparent" />
      
      <div className="relative section-container py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Copyright */}
          <div className="text-center md:text-left">
            <a
              href="#inicio"
              onClick={scrollToTop}
              className="inline-block text-2xl font-bold text-white mb-2 group"
            >
              PL<span className="text-[var(--color-accent)] glow-text">.</span>
            </a>
            <p className="text-sm text-[#64748b]">
              © {currentYear} {t('footer_copyright')}
            </p>
          </div>

          {/* Made with love */}
          <div className="flex items-center gap-2 text-sm text-[#64748b]">
            <span>{t('footer_made_with_love_part1')}</span>
            <FaHeart className="text-red-500 animate-pulse" />
            <span>{t('footer_made_with_love_part2')}</span>
            <span className="relative text-2xl group cursor-default">
              <span className="inline-block animate-bounce-soft">☕</span>
              {/* Steam animation */}
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-0.5 opacity-60">
                <span className="w-0.5 h-3 bg-gradient-to-t from-white/40 to-transparent rounded-full animate-steam-1" />
                <span className="w-0.5 h-2.5 bg-gradient-to-t from-white/30 to-transparent rounded-full animate-steam-2" />
                <span className="w-0.5 h-3 bg-gradient-to-t from-white/40 to-transparent rounded-full animate-steam-3" />
              </span>
            </span>
          </div>

          {/* Social Links & Back to top */}
          <div className="flex items-center gap-4">
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 glass-card-subtle rounded-xl hover:scale-110 transition-all"
              aria-label="GitHub"
            >
              <FaGithub className="w-5 h-5 text-white" />
            </a>
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 glass-card-subtle rounded-xl hover:scale-110 transition-all"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-5 h-5 text-white" />
            </a>
            
            <div className="w-px h-8 bg-white/10 mx-2" />
            
            <button
              onClick={scrollToTop}
              className="p-3 glass-card-subtle rounded-xl hover:scale-110 hover:bg-[var(--color-accent)]/20 transition-all group"
              aria-label={t('footer_scroll_to_top')}
            >
              <FaArrowUp className="w-5 h-5 text-white group-hover:text-[var(--color-accent)] transition-colors" />
            </button>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className="mt-8 pt-8 border-t border-white/5">
          <div className="h-1 w-32 mx-auto rounded-full bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-secondary)] to-[var(--color-accent)] opacity-50" />
        </div>
      </div>
    </footer>
  );
}
