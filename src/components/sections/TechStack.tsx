import { techStack } from '../../data';

export function TechStack() {
  return (
    <section id="tecnologias" className="py-20 bg-gray-50 dark:bg-dark-card">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Tecnologias
        </h2>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="flex flex-col items-center p-4 bg-white dark:bg-dark-bg rounded-lg hover:shadow-md transition"
            >
              <tech.icon className="text-2xl mb-2" style={{ color: tech.color }} />
              <span className="text-xs text-gray-600 dark:text-gray-400 text-center">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
