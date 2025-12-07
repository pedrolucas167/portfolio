import { useState } from 'react';
import { FaGithub, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';
import { projects, Project } from '../../data';

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="projetos" className="py-20 bg-white dark:bg-dark-bg">
      <div className="container mx-auto px-6 max-w-5xl">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Projetos
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelected(project)}
              className="bg-gray-50 dark:bg-dark-card rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition group"
            >
              <div className="h-40 bg-gradient-to-br from-accent/20 to-purple-500/20 flex items-center justify-center">
                <span className="text-4xl">{project.id === 1 ? '💌' : project.id === 2 ? '🔍' : '📦'}</span>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-accent transition">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="text-xs px-2 py-1 bg-gray-200 dark:bg-dark-border rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white dark:bg-dark-card rounded-xl max-w-lg w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selected.title}</h3>
                <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-gray-700">
                  <FaTimes />
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{selected.fullDescription || selected.description}</p>
              {selected.features && (
                <ul className="space-y-2 mb-4">
                  {selected.features.map((f, i) => (
                    <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex gap-2">
                      <span className="text-accent">✓</span> {f}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex gap-3">
                {selected.github && (
                  <a href={selected.github} target="_blank" rel="noopener noreferrer" 
                     className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm">
                    <FaGithub /> GitHub
                  </a>
                )}
                {selected.demo && (
                  <a href={selected.demo} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 px-4 py-2 bg-accent text-gray-900 rounded-lg text-sm">
                    <FaExternalLinkAlt /> Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
