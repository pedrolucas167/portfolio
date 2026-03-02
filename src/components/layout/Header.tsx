import { useState, useEffect } from 'react';
// ...existing code...
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
  const [activeSection, setActiveSection] = useState('#inicio');
  const { scrollY, scrollDirection } = useScrollPosition();
  const { scrollTo } = useSmoothScroll();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isScrolled = scrollY > 50;
  const isHidden = scrollDirection === 'down' && scrollY > 400;

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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement> | React.TouchEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollTo(href, { offset: 70 });
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
          <div className="md:hidden">
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
          </div>

          <a
            href="#contato"
            onClick={(e) => handleNavClick(e, '#contato')}
            className="hidden md:block btn-premium btn-primary-premium py-2 px-4 text-sm ml-2"
          >
            <span>Fale Comigo</span>
          </a>
        </nav>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={toggleMobileMenu}></div>
          <div className="fixed top-0 right-0 h-full w-64 bg-[var(--color-dark-bg)] shadow-lg z-50 p-5">
            <div className="flex justify-between items-center mb-5">
              <span className="text-2xl font-bold text-white">
                PL<span className="text-[var(--color-accent)] glow-text">.</span>
              </span>
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`nav-link-premium ${activeSection === item.href ? 'active' : ''} py-2 px-4 text-base`}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contato"
                onClick={(e) => handleNavClick(e, '#contato')}
                className="btn-premium btn-primary-premium py-2 px-4 text-base"
              >
                <span>Fale Comigo</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
