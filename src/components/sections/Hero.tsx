import { FaArrowDown } from 'react-icons/fa';

export function Hero() {
  return (
    <section id="inicio" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      <div className="text-center px-6">
        <img
          src="https://github.com/pedrolucas167.png"
          alt="Pedro Lucas"
          className="w-28 h-28 rounded-full mx-auto mb-6 border-4 border-accent shadow-xl"
        />
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          Pedro Lucas
        </h1>
        
        <p className="text-xl text-accent font-medium mb-4">
          Desenvolvedor Full-Stack
        </p>
        
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          Criando soluções com Java, React e arquiteturas modernas.
        </p>
        
        <div className="flex justify-center gap-4">
          <a
            href="#projetos"
            className="px-6 py-3 bg-accent text-gray-900 font-semibold rounded-lg hover:bg-accent/90 transition"
          >
            Ver Projetos
          </a>
          <a
            href="#contato"
            className="px-6 py-3 border border-white/30 text-white rounded-lg hover:bg-white/10 transition"
          >
            Contato
          </a>
        </div>
      </div>
      
      <button
        onClick={() => document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
      >
        <FaArrowDown className="text-white/50 text-xl" />
      </button>
    </section>
  );
}
