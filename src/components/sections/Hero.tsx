import { useEffect, useState } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FloatingOrbs, InteractiveAvatar } from '../ui';
import { useTypingEffect } from '../../hooks';
import { typingTexts, socialLinks } from '../../data';

export function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const typedText = useTypingEffect(typingTexts, 80, 40, 2500);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToSection = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="inicio" 
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-mesh" />
      
      {/* Animated floating orbs */}
      <FloatingOrbs />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Interactive Avatar */}
        <div 
          className={`mx-auto mb-6 transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <InteractiveAvatar
            src="https://github.com/pedrolucas167.png"
            alt="Pedro Lucas"
            className="mx-auto w-[100px] h-[100px] sm:w-[130px] sm:h-[130px]"
          />
        </div>

        {/* Status badge */}
        <div 
          className={`status-indicator mx-auto mb-4 transition-all duration-1000 delay-200 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Disponível para projetos
        </div>

        {/* Main heading with gradient */}
        <h1 
          className={`text-4xl md:text-6xl font-extrabold mb-2 transition-all duration-1000 delay-300 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="text-white">Pedro </span>
          <span className="text-gradient-animated">Lucas</span>
        </h1>

        {/* Role with glow */}
        <p 
          className={`text-lg md:text-xl font-semibold text-[var(--color-accent)] glow-text mb-2 transition-all duration-1000 delay-400 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Desenvolvedor Full-Stack
        </p>

        {/* Typing effect */}
        <div 
          className={`min-h-[28px] mb-6 transition-all duration-1000 delay-500 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <p className="text-base text-[#94a3b8] leading-relaxed">
            {typedText}
            <span className="animate-pulse text-[var(--color-accent)]">|</span>
          </p>
        </div>

        {/* CTA Buttons */}
        <div 
          className={`flex flex-col sm:flex-row justify-center gap-3 mb-8 transition-all duration-1000 delay-600 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <button
            onClick={() => scrollToSection('#projetos')}
            className="btn-premium btn-primary-premium"
          >
            <span>Ver Projetos</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <button
            onClick={() => scrollToSection('#contato')}
            className="btn-premium btn-secondary-premium"
          >
            <span>Entrar em Contato</span>
          </button>
        </div>

        {/* Social links */}
        <div 
          className={`flex justify-center gap-4 transition-all duration-1000 delay-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 glass-card-subtle rounded-full hover:scale-110 transition-transform"
            aria-label="GitHub"
          >
            <FaGithub className="w-6 h-6 text-white" />
          </a>
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 glass-card-subtle rounded-full hover:scale-110 transition-transform"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="w-6 h-6 text-white" />
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollToSection('#sobre')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#64748b] hover:text-[var(--color-accent)] transition-colors cursor-pointer group"
        aria-label="Rolar para baixo"
      >
        <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Rolar
        </span>
        <div className="w-6 h-10 rounded-full border-2 border-current flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-current rounded-full animate-bounce-soft" />
        </div>
      </button>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--color-dark-bg)] to-transparent" />
    </section>
  );
}

