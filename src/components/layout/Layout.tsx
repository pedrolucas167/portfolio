import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollProgress } from '../ui';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] text-white overflow-x-hidden">
      {/* Scroll progress indicator */}
      <ScrollProgress />
      
      {/* Background gradient mesh - fixed position */}
      <div className="fixed inset-0 bg-gradient-mesh opacity-30 pointer-events-none" />
      
      {/* Noise texture overlay */}
      <div className="fixed inset-0 bg-noise pointer-events-none" />
      
      <Header />
      
      <main className="relative">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
