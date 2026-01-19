import { FaCode, FaServer, FaCloud, FaLightbulb, FaRocket, FaUsers } from 'react-icons/fa';
import { GlassCard, SectionWrapper } from '../ui';
import { useReveal } from '../../hooks/useReveal';

const skills = [
  { 
    icon: FaCode, 
    title: 'Frontend', 
    desc: 'React, TypeScript, Tailwind CSS',
    color: 'from-cyan-500 to-blue-500',
    details: 'Interfaces modernas e responsivas com foco em performance e acessibilidade'
  },
  { 
    icon: FaServer, 
    title: 'Backend', 
    desc: 'Java, Spring Boot, Node.js',
    color: 'from-green-500 to-emerald-500',
    details: 'APIs robustas e escaláveis com arquitetura clean code'
  },
  { 
    icon: FaCloud, 
    title: 'DevOps', 
    desc: 'Docker, AWS, CI/CD',
    color: 'from-purple-500 to-pink-500',
    details: 'Automação, containerização e deploy contínuo'
  },
];

const highlights = [
  { icon: FaLightbulb, label: 'Pensamento Criativo', value: 'Soluções inovadoras' },
  { icon: FaRocket, label: 'Alta Performance', value: 'Código otimizado' },
  { icon: FaUsers, label: 'Colaboração', value: 'Trabalho em equipe' },
];

export function About() {
  const { ref, isRevealed } = useReveal({ threshold: 0.1 });

  return (
    <SectionWrapper id="sobre" className="bg-[var(--color-dark-bg)]">
      <div 
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`transition-all duration-1000 ${isRevealed ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Section header */}
        <div className="text-center mb-10">
          <span className="badge-premium accent mb-4 inline-block">Sobre mim</span>
          <h2 className="section-title mb-4">
            Transformando ideias em{' '}
            <span className="text-gradient-animated">código</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Desenvolvedor Full-Stack apaixonado por criar soluções que fazem a diferença. 
            Foco em código limpo, arquiteturas escaláveis e experiências de usuário excepcionais.
          </p>
        </div>

        {/* Skills grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {skills.map((skill, i) => (
            <GlassCard 
              key={skill.title}
              tilt
              className={`p-8 transition-all duration-700 ${
                isRevealed 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${i * 150}ms` } as React.CSSProperties}
            >
              {/* Icon with gradient background */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${skill.color} flex items-center justify-center mb-6 shadow-lg`}>
                <skill.icon className="text-2xl text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">
                {skill.title}
              </h3>
              
              <p className="text-[var(--color-accent)] font-medium text-sm mb-3">
                {skill.desc}
              </p>
              
              <p className="text-[#64748b] text-sm leading-relaxed">
                {skill.details}
              </p>
            </GlassCard>
          ))}
        </div>

        {/* Highlights */}
        <div className="glass-card-subtle p-8 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((item, i) => (
              <div 
                key={item.label}
                className={`flex items-center gap-4 transition-all duration-700 ${
                  isRevealed 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 -translate-x-10'
                }`}
                style={{ transitionDelay: `${600 + i * 150}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="text-xl text-[var(--color-accent)]" />
                </div>
                <div>
                  <p className="text-sm text-[#64748b]">{item.label}</p>
                  <p className="text-white font-semibold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
