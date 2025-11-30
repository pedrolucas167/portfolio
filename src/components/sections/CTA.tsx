import { FaRocket, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

export function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-accent/10 via-emerald-500/10 to-teal-500/10 dark:from-accent/5 dark:via-emerald-900/10 dark:to-dark-bg">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <div className="bg-white dark:bg-dark-card rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-200 dark:border-dark-border relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-emerald-400 to-teal-400" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent to-emerald-500 rounded-2xl mb-6 shadow-lg shadow-accent/30">
              <FaRocket className="text-2xl text-white" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Vamos Construir Algo Incrível Juntos?
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
              Estou disponível para novos projetos, colaborações e oportunidades. 
              Entre em contato e vamos transformar suas ideias em realidade!
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://wa.me/5500000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 transition-all hover:scale-105"
              >
                <FaWhatsapp className="text-xl" />
                WhatsApp
              </a>
              
              <a
                href="mailto:pedro_marques_dev@hotmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-emerald-500 hover:from-accent/90 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-accent/30 transition-all hover:scale-105"
              >
                <FaEnvelope className="text-xl" />
                Enviar Email
              </a>
            </div>
            
            <p className="mt-6 text-sm text-gray-500 dark:text-gray-500">
              ⚡ Resposta em até 24 horas
            </p>
          </div>
          
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
}

export default CTA;
