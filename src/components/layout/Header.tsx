import { useState, useEffect, useCallback } from 'react';
import { useScrollPosition, useSmoothScroll } from '../../hooks';
import { useTranslation } from 'react-i18next';
import { i18n as I18nInstance } from 'i18next'; // Import i18n type

interface HeaderProps {
  i18n: I18nInstance; // Add i18n prop
}

export function Header({ i18n }: HeaderProps) {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('#inicio');
  const { scrollY, scrollDirection } = useScrollPosition();
  const { scrollTo } = useSmoothScroll();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isScrolled = scrollY > 50;
  const isHidden = scrollDirection === 'down' && scrollY > 400;

  const navItems = [
    { label: t('nav_home'), href: '#inicio' },
    { label: t('nav_about'), href: '#sobre' },
    { label: t('nav_tech'), href: '#tecnologias' },
    { label: t('nav_projects'), href: '#projetos' },
    { label: t('nav_game'), href: '#game' },
    { label: t('nav_contact'), href: '#contato' },
  ];

  useEffect(() => {
    const sections = navItems.map(item => item.href.slice(1));
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      // iterate from bottom to top without mutating the sections array
      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        const element = document.getElementById(sec);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(`#${sec}`);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]); // Re-run effect if navItems change (due to language change)

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement> | React.TouchEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    // set active immediately for responsive feedback, then perform smooth scroll
    setActiveSection(href);
    scrollTo(href, { offset: 80 });
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isMobileMenuOpen]);

  // Close on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isHidden ? '-translate-y-full' : 'translate-y-0'
      } ${
        isScrolled
          ? 'py-3'
          : 'py-5'
      }`}
    >
      <div 
        className={`absolute inset-0 transition-all duration-500 ${
          isScrolled 
            ? 'bg-[var(--color-dark-bg)]/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/10'
            : 'bg-transparent'
        }`}
      />

      <div className="relative section-container">
        <nav className="flex items-center justify-between">
          <a
            href="#inicio"
            onClick={(e) => handleNavClick(e, '#inicio')}
            className="relative group"
          >
            <span className="text-2xl font-bold text-white">
              PL<span className="text-[var(--color-accent)] glow-text">.</span>
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] group-hover:w-full transition-all duration-300" />
          </a>
          <div className="md:hidden flex items-center gap-2"> {/* Added gap for language selector */}
            <select
              onChange={(e) => changeLanguage(e.target.value)}
              value={i18n.language}
              className="bg-transparent text-white border border-white/20 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            >
              <option value="pt" className="bg-[var(--color-dark-bg)]">PT</option>
              <option value="en" className="bg-[var(--color-dark-bg)]">EN</option>
              <option value="zh" className="bg-[var(--color-dark-bg)]">ZH</option>
              <option value="de" className="bg-[var(--color-dark-bg)]">DE</option>
            </select>
            <button
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Navegação para desktop */}
          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`nav-link-premium ${activeSection === item.href ? 'active' : ''} py-2 px-4 text-sm`}
              >
                {item.label}
              </a>
            ))}
            <select
              onChange={(e) => changeLanguage(e.target.value)}
              value={i18n.language}
              className="bg-transparent text-white border border-white/20 rounded-md py-1 px-2 text-sm ml-4 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            >
              <option value="pt" className="bg-[var(--color-dark-bg)]">PT</option>
              <option value="en" className="bg-[var(--color-dark-bg)]">EN</option>
              <option value="zh" className="bg-[var(--color-dark-bg)]">ZH</option>
              <option value="de" className="bg-[var(--color-dark-bg)]">DE</option>
            </select>
          </div>

          <a
            href="#contato"
            onClick={(e) => handleNavClick(e, '#contato')}
            className="hidden md:block btn-premium btn-primary-premium py-2 px-4 text-sm ml-2"
          >
            <span>{t('speak_to_me')}</span>
          </a>
        </nav>
      </div>
    </header>

      {/* Mobile menu - fullscreen overlay (best practice for mobile) */}
      <div
        className={`md:hidden fixed inset-0 z-[100] transition-all duration-300 ${
          isMobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
      >
        {/* Fullscreen background */}
        <div
          className={`absolute inset-0 bg-[var(--color-dark-bg)] transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Content */}
        <div
          className={`relative h-full flex flex-col transition-all duration-300 ease-out ${
            isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-5">
            <span className="text-2xl font-bold text-white">
              PL<span className="text-[var(--color-accent)] glow-text">.</span>
            </span>
            <button
              onClick={toggleMobileMenu}
              className="text-white/70 hover:text-white focus:outline-none transition-colors p-2 -mr-2 min-w-[48px] min-h-[48px] flex items-center justify-center"
              aria-label="Fechar menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Nav links - centered vertically */}
          <div className="flex-1 flex flex-col justify-center px-6 gap-2">
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`min-h-[48px] flex items-center text-lg font-medium rounded-xl px-5 transition-all duration-200 ${
                  activeSection === item.href
                    ? 'text-[var(--color-accent)] bg-[var(--color-accent)]/10'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
                style={{ transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms' }}
              >
                {item.label}
              </a>
            ))}
            <div className="mt-4 px-5">
              <select
                onChange={(e) => changeLanguage(e.target.value)}
                value={i18n.language}
                className="bg-[var(--color-dark-bg)] text-white border border-white/20 rounded-md py-2 px-3 text-base w-full focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              >
                <option value="pt" className="bg-[var(--color-dark-bg)]">Português</option>
                <option value="en" className="bg-[var(--color-dark-bg)]">English</option>
                <option value="zh" className="bg-[var(--color-dark-bg)]">中文</option>
                <option value="de" className="bg-[var(--color-dark-bg)]">Deutsch</option>
              </select>
            </div>
          </div>

          {/* CTA button - bottom */}
          <div className="px-6 pb-8 pt-4">
            <a
              href="#contato"
              onClick={(e) => handleNavClick(e, '#contato')}
              className="btn-premium btn-primary-premium py-4 px-6 text-base w-full text-center block min-h-[48px]"
            >
              <span>{t('speak_to_me')}</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
