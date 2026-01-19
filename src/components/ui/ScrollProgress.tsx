import { useScrollProgress } from '../../hooks';

export function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[60]">
      <div 
        className="h-full bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-secondary)] to-[var(--color-accent)] transition-all duration-150 ease-out"
        style={{ 
          width: `${progress}%`,
          boxShadow: '0 0 20px var(--color-accent-glow), 0 0 40px var(--color-accent-glow)'
        }}
      />
    </div>
  );
}
