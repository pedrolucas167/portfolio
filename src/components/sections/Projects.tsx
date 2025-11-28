import { useState } from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { Card, CardContent, Badge, Modal } from '../ui';
import { projects, Project } from '../../data';
import { useIntersectionObserver } from '../../hooks';

interface ProjectModalContentProps {
  project: Project;
}

function ProjectModalContent({ project }: ProjectModalContentProps) {
  return (
    <div>
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-accent/20 to-accent-dark/20">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">🚀</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-6 right-6">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{project.title}</h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="primary">{tech}</Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Sobre o Projeto
          </h4>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {project.fullDescription || project.description}
          </p>
        </div>

        {project.features && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Funcionalidades
            </h4>
            <ul className="space-y-2">
              {project.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <span className="text-accent mt-1">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100 dark:border-dark-border">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:opacity-80 transition-opacity"
            >
              <FaGithub className="w-5 h-5" />
              Ver no GitHub
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-gray-900 rounded-lg hover:bg-accent-light transition-colors"
            >
              <FaExternalLinkAlt className="w-4 h-4" />
              Acessar Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section id="projetos" className="py-24 bg-gray-50 dark:bg-dark-bg">
      <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Meus <span className="text-accent">Projetos</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Alguns dos projetos que desenvolvi com paixão e dedicação
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                hover
                onClick={() => setSelectedProject(project)}
                className="overflow-hidden group"
              >
                <div className="relative h-48 bg-gradient-to-br from-accent/20 to-accent-dark/20 overflow-hidden">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl group-hover:scale-110 transition-transform duration-500">
                        {project.id === 1 ? '💌' : project.id === 2 ? '🔍' : '📦'}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <CardContent className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge>+{project.technologies.length - 3}</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Modal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      >
        {selectedProject && <ProjectModalContent project={selectedProject} />}
      </Modal>
    </section>
  );
}
