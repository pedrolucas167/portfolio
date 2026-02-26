import { techStack } from '../../data';
import { SectionWrapper } from '../ui';
import { useReveal } from '../../hooks/useReveal';

export function TechStack() {
  const { ref, isRevealed } = useReveal({ threshold: 0.1 });

  return (
    <SectionWrapper id="tecnologias">
      <div 
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`transition-all duration-1000 ${isRevealed ? 'opacity-100' : 'opacity-0'}`}
      >
        
        <div className="text-center mb-8 sm:mb-10">
          <span className="badge-premium secondary mb-3 sm:mb-4 inline-block">Tech Stack</span>
          <h2 className="section-title mb-3 sm:mb-4">
            Tecnologias que{' '}
            <span className="text-gradient-animated">domino</span>
          </h2>
          <p className="section-subtitle mx-auto px-2 sm:px-0">
            Ferramentas e tecnologias que utilizo para criar soluções robustas e escaláveis.
          </p>
        </div>

        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          {techStack.map((tech, index) => (
            <div
              key={tech.name}
              className={`tech-badge-premium transition-all duration-700 ${
                isRevealed 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ 
                transitionDelay: `${index * 50}ms`,
              }}
            >
              <tech.icon 
                className="tech-icon" 
                style={{ color: tech.color }}
              />
              <span className="tech-name text-center">{tech.name}</span>
              
              
              {tech.level && (
                <div className="w-full mt-1.5 sm:mt-2">
                  <div className="h-0.5 sm:h-1 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 delay-500"
                      style={{
                        width: isRevealed ? `${tech.level}%` : '0%',
                        background: `linear-gradient(90deg, ${tech.color}, var(--color-secondary))`,
                        boxShadow: `0 0 10px ${tech.color}50`
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        
        <div className="mt-10 sm:mt-16 text-center">
          <p className="text-[#64748b] text-base sm:text-lg md:text-xl px-4 sm:px-0">
            E sempre aprendendo novas tecnologias...
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
