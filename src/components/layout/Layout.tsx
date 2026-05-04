import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollProgress } from '../ui';
import { i18n as I18nInstance } from 'i18next'; // Import i18n type

interface LayoutProps {
  children: ReactNode;
  i18n: I18nInstance; // Add i18n prop
}

export function Layout({ children, i18n }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] text-white overflow-x-hidden">
      {/* Scroll progress indicator */}
      <ScrollProgress />
      
      {/* Background gradient mesh - fixed position */}
      <div className="fixed inset-0 bg-gradient-mesh opacity-30 pointer-events-none" />
      
      {/* Noise texture overlay */}
      <div className="fixed inset-0 bg-noise pointer-events-none" />
      
      <Header i18n={i18n} /> {/* Pass i18n to Header */}
      
      <main className="relative">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
