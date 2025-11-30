import { FaCode, FaLaptopCode, FaRocket } from 'react-icons/fa';
import { useIntersectionObserver } from '../../hooks';

export function About() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  const highlights = [
    {
      icon: FaCode,
      title: 'Clean Code',
      description: 'Código limpo, legível e de fácil manutenção',
    },
    {
      icon: FaLaptopCode,
      title: 'Full-Stack',
      description: 'Desenvolvimento completo, do backend ao frontend',
    },
    {
      icon: FaRocket,
      title: 'Performance',
      description: 'Aplicações otimizadas e escaláveis',
    },
  ];

  return (
    <section id="sobre" className="py-20 bg-gray-50 dark:bg-dark-bg">
      <div className="container mx-auto px-6 max-w-6xl">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Sobre <span className="text-accent">Mim</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Conheça um pouco mais sobre minha jornada e o que me motiva
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Sou um desenvolvedor Full-Stack com paixão por criar soluções tecnológicas que fazem a diferença. 
                Minha jornada na programação começou com a curiosidade de entender como as coisas funcionam, 
                e hoje transformo essa curiosidade em código de qualidade.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Atualmente, foco em tecnologias como <span className="text-accent font-semibold">Java</span>, 
                <span className="text-accent font-semibold"> Spring Boot</span>, 
                <span className="text-accent font-semibold"> React</span> e 
                <span className="text-accent font-semibold"> TypeScript</span>. 
                Também tenho experiência com cloud computing, Docker e práticas de DevOps.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Acredito que bons softwares são construídos com atenção aos detalhes, 
                código limpo e uma boa experiência do usuário. Estou sempre aprendendo 
                e buscando novos desafios.
              </p>
            </div>

            <div className="space-y-6">
              {highlights.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-6 bg-gray-50 dark:bg-dark-bg rounded-xl hover:shadow-lg transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-3 bg-accent/20 rounded-lg">
                    <item.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
