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
        
        <div className="text-center mb-8 sm:mb-10">
          <span className="badge-premium accent mb-3 sm:mb-4 inline-block">Sobre mim</span>
          <h2 className="section-title mb-3 sm:mb-4">
            Transformando ideias em{' '}
            <span className="text-gradient-animated">código</span>
          </h2>
          <p className="section-subtitle mx-auto px-2 sm:px-0">
            Desenvolvedor Full-Stack apaixonado por criar soluções que fazem a diferença. 
            Foco em código limpo, arquiteturas escaláveis e experiências de usuário excepcionais.
          </p>
          <p className="mt-4 mx-auto max-w-3xl px-2 sm:px-0 text-sm sm:text-base text-[#94a3b8] leading-relaxed">
            Como hobby, contribuí no Brainly entre 2016 e 2025 — mais de 1.800 respostas e 12.000+ agradecimentos — ajudando estudantes com explicações claras e didáticas em Matemática, Física, Filosofia e Programação. Atualmente não tenho disponibilidade regular para colaborar.
          </p>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-16">
          {skills.map((skill, i) => (
            <GlassCard 
              key={skill.title}
              tilt
              className={`p-5 sm:p-8 transition-all duration-700 ${
                isRevealed 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${i * 150}ms` } as React.CSSProperties}
            >
              
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${skill.color} flex items-center justify-center mb-4 sm:mb-6 shadow-lg`}>
                <skill.icon className="text-xl sm:text-2xl text-white" />
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 sm:mb-2">
                {skill.title}
              </h3>
              
              <p className="text-[var(--color-accent)] font-medium text-xs sm:text-sm mb-2 sm:mb-3">
                {skill.desc}
              </p>
              
              <p className="text-[#64748b] text-xs sm:text-sm leading-relaxed">
                {skill.details}
              </p>
            </GlassCard>
          ))}
        </div>

        
        <div className="glass-card-subtle p-5 sm:p-8 rounded-xl sm:rounded-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8">
            {highlights.map((item, i) => (
              <div 
                key={item.label}
                className={`flex items-center gap-3 sm:gap-4 transition-all duration-700 ${
                  isRevealed 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 -translate-x-10'
                }`}
                style={{ transitionDelay: `${600 + i * 150}ms` }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="text-lg sm:text-xl text-[var(--color-accent)]" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-[#64748b]">{item.label}</p>
                  <p className="text-white font-semibold text-sm sm:text-base">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
