import { useState } from 'react';
import { FaGithub, FaExternalLinkAlt, FaTimes, FaChevronRight } from 'react-icons/fa';
import { projects, Project } from '../../data';
import { GlassCard, SectionWrapper } from '../ui';
import { useReveal } from '../../hooks/useReveal';

const projectEmojis: Record<number, string> = {
  1: '🧩',
  2: '🧪',
  3: '💝',
  4: '📦',
};

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);
  const { ref, isRevealed } = useReveal({ threshold: 0.1 });

  const closeModal = () => setSelected(null);

  return (
    <SectionWrapper id="projetos">
      <div 
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`transition-all duration-1000 ${isRevealed ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Section header */}
        <div className="text-center mb-8 sm:mb-10">
          <span className="badge-premium accent mb-3 sm:mb-4 inline-block">Trabalhos</span>
          <h2 className="section-title mb-3 sm:mb-4">
            Projetos{' '}
            <span className="text-gradient-animated">em destaque</span>
          </h2>
          <p className="section-subtitle mx-auto px-2 sm:px-0">
            Uma curadoria dos meus trabalhos mais significativos e impactantes.
          </p>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((project, index) => (
            <GlassCard
              key={project.id}
              tilt
              onClick={() => setSelected(project)}
              className={`group cursor-pointer transition-all duration-700 ${
                isRevealed 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` } as React.CSSProperties}
            >
              {/* Project image/icon area */}
              <div className={`h-40 sm:h-48 bg-gradient-to-br ${project.gradient} relative overflow-hidden`}>
                {/* Pattern overlay */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '20px 20px'
                  }}
                />
                
                {/* Emoji/Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl sm:text-6xl transform group-hover:scale-110 transition-transform duration-500">
                    {projectEmojis[project.id] || '🚀'}
                  </span>
                </div>

                {/* Category badge */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                  <span className="badge-premium bg-black/30 backdrop-blur-sm border-white/20 text-white text-xs">
                    {project.category}
                  </span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-medium flex items-center gap-2 text-sm sm:text-base">
                    Ver detalhes <FaChevronRight className="text-xs sm:text-sm" />
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 sm:mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                  {project.title}
                </h3>
                <p className="text-[#94a3b8] text-xs sm:text-sm line-clamp-2 mb-3 sm:mb-4">
                  {project.description}
                </p>
                
                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span 
                      key={tech} 
                      className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/5 text-[#94a3b8] border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/5 text-[#64748b]">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div 
          className="modal-overlay-premium active"
          onClick={closeModal}
        >
          <div 
            className="modal-content-premium"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header with gradient */}
            <div className={`h-32 bg-gradient-to-br ${selected.gradient} relative`}>
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                  backgroundSize: '20px 20px'
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl">
                  {projectEmojis[selected.id] || '🚀'}
                </span>
              </div>
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                aria-label="Fechar"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto modal-scroll">
              <span className="badge-premium accent text-xs mb-3 inline-block">
                {selected.category}
              </span>
              
              <h3 className="text-2xl font-bold text-white mb-4">
                {selected.title}
              </h3>
              
              <p className="text-[#94a3b8] mb-6 leading-relaxed">
                {selected.fullDescription || selected.description}
              </p>

               {/* Features */}
               {selected.features && selected.features.length > 0 && (
                 <div className="mb-6">
                   <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
                     Destaques
                   </h4>
                   <ul className="space-y-2">
                     {selected.features.map((feature, i) => (
                       <li
                         key={i}
                         className="flex items-start gap-3 text-sm text-[#94a3b8]"
                       >
                         <span className="text-[var(--color-accent)] mt-1">✦</span>
                         {feature}
                       </li>
                     ))}
                   </ul>
                 </div>
               )}

              {/* Technologies */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
                  Tecnologias
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selected.technologies.map((tech) => (
                    <span 
                      key={tech}
                      className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-[#94a3b8] border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-4 border-t border-white/5">
                {selected.github && (
                  <a 
                    href={selected.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-premium btn-secondary-premium flex-1 justify-center"
                  >
                    <FaGithub className="text-lg" />
                    <span>Código</span>
                  </a>
                )}
                {selected.demo && (
                  <a 
                    href={selected.demo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-premium btn-primary-premium flex-1 justify-center"
                  >
                    <FaExternalLinkAlt />
                    <span>Demo</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}
