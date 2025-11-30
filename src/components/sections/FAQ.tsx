import { useState } from 'react';
import { FaQuestionCircle, FaChevronDown } from 'react-icons/fa';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'Quais tecnologias você domina?',
    answer: 'Trabalho principalmente com Java (Spring Boot), React, TypeScript, Node.js e bancos de dados SQL/NoSQL. Também tenho experiência com Docker, AWS e metodologias ágeis.',
  },
  {
    question: 'Você trabalha como freelancer?',
    answer: 'Sim! Estou disponível para projetos freelance, seja desenvolvimento completo, consultoria técnica ou mentoria. Entre em contato para discutirmos seu projeto.',
  },
  {
    question: 'Qual é o seu prazo médio de entrega?',
    answer: 'Depende da complexidade do projeto. Projetos simples podem levar de 1-2 semanas, enquanto sistemas mais complexos podem levar alguns meses. Sempre defino prazos realistas após entender o escopo.',
  },
  {
    question: 'Você oferece suporte após a entrega?',
    answer: 'Sim! Ofereço período de suporte para correções e ajustes após a entrega. Também disponibilizo contratos de manutenção para projetos que precisam de acompanhamento contínuo.',
  },
  {
    question: 'Como funciona o processo de desenvolvimento?',
    answer: 'Sigo metodologias ágeis: começamos com levantamento de requisitos, depois prototipação, desenvolvimento em sprints com entregas parciais, testes e deploy. Você acompanha todo o progresso.',
  },
  {
    question: 'Você trabalha remotamente?',
    answer: 'Sim, trabalho 100% remoto. Utilizo ferramentas como Slack, Discord, Meet e Jira para manter comunicação clara e frequente com os clientes.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-gray-50 dark:bg-dark-card/50">
      <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium mb-4">
            <FaQuestionCircle /> Dúvidas Frequentes
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Perguntas Frequentes
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto text-sm">
            Algumas respostas para as perguntas mais comuns sobre meu trabalho.
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="font-semibold text-gray-900 dark:text-white pr-4">
                  {item.question}
                </span>
                <FaChevronDown
                  className={`flex-shrink-0 text-accent transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="px-6 pb-5 text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Ainda tem dúvidas?{' '}
            <a
              href="#contato"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-accent hover:underline font-medium"
            >
              Entre em contato
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
