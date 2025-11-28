import { FaArrowDown } from 'react-icons/fa';
import { Button } from '../ui';

export function Hero() {
  return (
    <section id="inicio" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent to-accent-dark p-1 shadow-2xl">
              <img
                src="https://github.com/pedrolucas167.png"
                alt="Pedro Lucas"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-accent text-gray-900 px-2 py-0.5 rounded-full text-xs font-semibold shadow-lg">
              Disponível
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-3">
          Pedro Lucas
        </h1>

        <p className="text-xl md:text-2xl text-accent font-semibold mb-4">
          Desenvolvedor Full-Stack
        </p>

        <p className="text-base md:text-lg text-gray-300 mb-6 max-w-xl mx-auto">
          Criando soluções inovadoras com Java, React e arquiteturas modernas.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
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
            Contato
          </Button>
        </div>
      </div>

      <button 
        onClick={() => document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce cursor-pointer hover:scale-110 transition-transform"
        aria-label="Rolar para próxima seção"
      >
        <FaArrowDown className="w-6 h-6 text-white/70 hover:text-accent" />
      </button>
    </section>
  );
}
