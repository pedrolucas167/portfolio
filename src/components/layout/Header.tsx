import { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useScrollPosition, useSmoothScroll } from '../../hooks';

const navItems = [
  { label: 'Início', href: '#inicio' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Tecnologias', href: '#tecnologias' },
  { label: 'Projetos', href: '#projetos' },
  { label: '🎮 Game', href: '#game' },
  { label: 'Contato', href: '#contato' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#inicio');
  const { scrollY, scrollDirection } = useScrollPosition();
  const { scrollTo } = useSmoothScroll();
  
  const isScrolled = scrollY > 50;
  const isHidden = scrollDirection === 'down' && scrollY > 400 && !isMenuOpen;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Detect active section
  useEffect(() => {
    const sections = navItems.map(item => item.href.slice(1));
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(`#${section}`);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement> | React.TouchEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    closeMenu();
    setTimeout(() => {
      scrollTo(href, { offset: 70 });
    }, 100);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isHidden ? '-translate-y-full' : 'translate-y-0'
      } ${
        isScrolled
          ? 'py-3'
          : 'py-5'
      }`}
    >
      {/* Glassmorphism background */}
      <div 
        className={`absolute inset-0 transition-all duration-500 ${
          isScrolled 
            ? 'bg-[var(--color-dark-bg)]/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/10'
            : 'bg-transparent'
        }`}
      />

      <div className="relative section-container">
        <nav className="flex items-center justify-between">
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`nav-link-premium ${activeSection === item.href ? 'active' : ''}`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <a
            href="#contato"
            onClick={(e) => handleNavClick(e, '#contato')}
            className="hidden md:flex btn-premium btn-primary-premium py-2 px-4 text-sm"
          >
            <span>Fale Comigo</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="relative md:hidden p-2 rounded-xl glass-card-subtle"
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            <span className={`block transition-all duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}>
              {isMenuOpen ? (
                <FaTimes className="w-5 h-5 text-white" />
              ) : (
                <FaBars className="w-5 h-5 text-white" />
              )}
            </span>
          </button>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300 z-40 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
        onTouchEnd={closeMenu}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] glass-strong border-l border-white/10 md:hidden transition-transform duration-500 ease-out z-50 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Mobile menu header */}
          <div className="flex items-center justify-between mb-10">
            <span className="text-2xl font-bold text-white">
              PL<span className="text-[var(--color-accent)]">.</span>
            </span>
            <button
              onClick={closeMenu}
              className="p-2 rounded-xl glass-card-subtle"
              aria-label="Fechar menu"
            >
              <FaTimes className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Mobile nav items */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {navItems.map((item, index) => (
                <li 
                  key={item.href}
                  className={`transition-all duration-500 ${
                    isMenuOpen 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 translate-x-10'
                  }`}
                  style={{ transitionDelay: `${index * 75}ms` }}
                >
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`block py-3 px-4 rounded-xl text-lg font-medium transition-all ${
                      activeSection === item.href
                        ? 'text-[var(--color-accent)] bg-[var(--color-accent)]/10'
                        : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile CTA */}
          <div 
            className={`mt-auto pt-6 border-t border-white/10 transition-all duration-500 ${
              isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <a
              href="#contato"
              onClick={(e) => handleNavClick(e, '#contato')}
              className="btn-premium btn-primary-premium w-full justify-center"
            >
              <span>Fale Comigo</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
