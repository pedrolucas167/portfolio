import { FaCode, FaServer, FaCloud } from 'react-icons/fa';

const skills = [
  { icon: FaCode, title: 'Frontend', desc: 'React, TypeScript, Tailwind' },
  { icon: FaServer, title: 'Backend', desc: 'Java, Spring Boot, Node.js' },
  { icon: FaCloud, title: 'DevOps', desc: 'Docker, AWS, CI/CD' },
];

export function About() {
  return (
    <section id="sobre" className="py-20 bg-white dark:bg-dark-bg">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
          Sobre Mim
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto mb-12">
          Desenvolvedor Full-Stack apaixonado por criar soluções que fazem a diferença. 
          Foco em código limpo, arquiteturas escaláveis e experiências de usuário excepcionais.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {skills.map((skill, i) => (
            <div key={i} className="p-6 bg-gray-50 dark:bg-dark-card rounded-xl text-center">
              <skill.icon className="text-3xl text-accent mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{skill.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{skill.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
