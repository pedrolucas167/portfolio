import { useEffect, useState } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FloatingOrbs, InteractiveAvatar } from '../ui';
import { useTypingEffect } from '../../hooks';
import { typingTexts, socialLinks, personalInfo } from '../../data'; // Import personalInfo
import { useTranslation } from 'react-i18next'; // Import useTranslation

export function Hero() {
  const { t } = useTranslation(); // Initialize useTranslation
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Translate typingTexts before passing to useTypingEffect
  const translatedTypingTexts = typingTexts.map(key => t(key));
  const typedText = useTypingEffect(translatedTypingTexts, 80, 40, 2500);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToSection = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="inicio" 
      className="relative min-h-[100svh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden pt-16 sm:pt-20 pb-16 sm:pb-0"
    >
      
      <div className="absolute inset-0 bg-gradient-mesh" />
      
      
      <FloatingOrbs />
      
      
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }}
      />

      
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        
        <div 
          className={`mx-auto mb-4 sm:mb-6 transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <InteractiveAvatar
            src="https://github.com/pedrolucas167.png"
            alt="Pedro Lucas Marques"
            className="mx-auto w-[90px] h-[90px] sm:w-[130px] sm:h-[130px]"
          />
        </div>

        
        <div 
          className={`status-indicator mx-auto mb-3 sm:mb-4 transition-all duration-1000 delay-200 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {t('hero_available_for_projects')} {/* Translated */}
        </div>

        
        <h1 
          className={`text-3xl sm:text-4xl md:text-6xl font-extrabold mb-2 transition-all duration-1000 delay-300 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="text-white">Pedro Lucas </span>
          <span className="text-gradient-animated">Marques</span>
        </h1>

        
        <p 
          className={`text-base sm:text-lg md:text-xl font-semibold text-[var(--color-accent)] glow-text mb-2 transition-all duration-1000 delay-400 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {t(personalInfo.role)} {/* Translated using personalInfo.role key */}
        </p>

        
        <div 
          className={`min-h-[24px] sm:min-h-[28px] mb-5 sm:mb-6 transition-all duration-1000 delay-500 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed px-2">
            {typedText}
            <span className="animate-pulse text-[var(--color-accent)]">|</span>
          </p>
        </div>


        <div
          className={`flex flex-col sm:flex-row justify-center gap-3 mb-6 sm:mb-8 px-4 sm:px-0 transition-all duration-1000 delay-600 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <button
            onClick={() => scrollToSection('#projetos')}
            className="btn-premium btn-primary-premium"
          >
            <span>{t('hero_explore_work')}</span> {/* Translated */}
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <button
            onClick={() => scrollToSection('#contato')}
            className="btn-premium btn-secondary-premium"
          >
            <span>{t('hero_start_conversation')}</span> {/* Translated */}
          </button>
          <a
            href={`${import.meta.env.BASE_URL}resume/resume_pedromarques.pdf`}
            download="resume_pedro_marques.pdf"
            className="btn-premium btn-secondary-premium"
          >
            <span>{t('hero_download_resume')}</span>
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
        </div>

        
        <div 
          className={`flex justify-center gap-3 sm:gap-4 transition-all duration-1000 delay-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 sm:p-3 glass-card-subtle rounded-full hover:scale-110 transition-transform"
            aria-label="GitHub"
          >
            <FaGithub className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </a>
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 sm:p-3 glass-card-subtle rounded-full hover:scale-110 transition-transform"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </a>
        </div>
      </div>

      
      <button
        onClick={() => scrollToSection('#sobre')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-[#64748b] hover:text-[var(--color-accent)] transition-colors cursor-pointer group"
        aria-label="Rolar para baixo"
      >
        <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          {t('hero_scroll_down')} {/* Translated */}
        </span>
        <div className="w-6 h-10 rounded-full border-2 border-current flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-current rounded-full animate-bounce-soft" />
        </div>
      </button>

      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--color-dark-bg)] to-transparent" />
    </section>
  );
}