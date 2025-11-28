import { FaArrowDown } from 'react-icons/fa';
import { useTypingEffect } from '../../hooks';
import { Button } from '../ui';
import { typingTexts } from '../../data';

export function Hero() {
  const typedText = useTypingEffect(typingTexts, 100, 50, 2000);

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <div className="relative inline-block">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-accent to-accent-dark p-1 shadow-2xl">
              <img
                src="https://github.com/pedrolucas167.png"
                alt="Pedro Lucas"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-accent text-gray-900 px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              Disponível
            </div>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-fade-in animation-delay-100">
          Pedro Lucas
        </h1>

        <div className="h-12 mb-6 animate-fade-in animation-delay-200">
          <span className="text-2xl md:text-3xl text-accent font-semibold">
            {typedText}
            <span className="animate-pulse">|</span>
          </span>
        </div>

        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-in animation-delay-300">
          Desenvolvedor Full-Stack apaixonado por criar soluções inovadoras e escaláveis. 
          Desenvolvedor Java, React e arquiteturas modernas.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animation-delay-400">
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => document.getElementById('projetos')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Ver Projetos
          </Button>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Entrar em Contato
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <FaArrowDown className="w-6 h-6 text-white/60" />
      </div>
    </section>
  );
}
