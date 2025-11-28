import { techStack } from '../../data';
import { useIntersectionObserver } from '../../hooks';

export function TechStack() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section id="tecnologias" className="py-24 bg-white dark:bg-dark-card">
      <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Tech <span className="text-accent">Stack</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Tecnologias e ferramentas que utilizo no dia a dia
            </p>
          </div>

          {/* Tech Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {techStack.map((tech, index) => (
              <div
                key={tech.name}
                className="group relative p-5 bg-gray-50 dark:bg-dark-bg rounded-xl hover:bg-gradient-to-br hover:from-accent/5 hover:to-accent/10 border border-gray-100 dark:border-dark-border hover:border-accent/20 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col items-center text-center">
                  <div 
                    className="text-3xl md:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300"
                    style={{ color: tech.color }}
                  >
                    <tech.icon />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-accent transition-colors">
                    {tech.name}
                  </h3>
                  {tech.level && (
                    <div className="mt-2 w-full">
                      <div className="h-1 bg-gray-200 dark:bg-dark-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent transition-all duration-500"
                          style={{ width: `${tech.level}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-10 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              E sempre aprendendo novas tecnologias! 🚀
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
