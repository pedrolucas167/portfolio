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
        {/* Section header */}
        <div className="text-center mb-10">
          <span className="badge-premium secondary mb-4 inline-block">Tech Stack</span>
          <h2 className="section-title mb-4">
            Tecnologias que{' '}
            <span className="text-gradient-animated">domino</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Ferramentas e tecnologias que utilizo para criar soluções robustas e escaláveis.
          </p>
        </div>

        {/* Tech grid with premium badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {techStack.map((tech, index) => (
            <div
              key={tech.name}
              className={`tech-badge-premium transition-all duration-700 ${
                isRevealed 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ 
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <tech.icon 
                className="tech-icon" 
                style={{ color: tech.color }}
              />
              <span className="tech-name">{tech.name}</span>
              
              {/* Skill level indicator */}
              {tech.level && (
                <div className="w-full mt-2">
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
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

        {/* Additional info */}
        <div className="mt-16 text-center">
          <p className="text-[#64748b] text-lg md:text-xl">
            E sempre aprendendo novas tecnologias...
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
