import { FaBook, FaBookReader, FaCheckCircle } from 'react-icons/fa';

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  status: 'reading' | 'completed' | 'next';
  progress?: number;
  category: string;
}

const books: Book[] = [
  {
    id: 1,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    cover: 'https://m.media-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg',
    status: 'reading',
    progress: 65,
    category: 'Boas Práticas',
  },
  {
    id: 2,
    title: 'Desenvolvimento Real de Software',
    author: 'Raoul-Gabriel Urma & Richard Warburton',
    cover: 'https://m.media-amazon.com/images/I/81qtYndDtoL._SY466_.jpg',
    status: 'reading',
    progress: 40,
    category: 'Java',
  },
  {
    id: 3,
    title: 'Learning Domain-Driven Design',
    author: 'Vlad Khononov',
    cover: 'https://m.media-amazon.com/images/I/61u5lPCcdtL._SY466_.jpg',
    status: 'next',
    category: 'Arquitetura',
  },
];

const statusConfig = {
  reading: { label: 'Lendo', color: 'bg-blue-500', icon: FaBookReader },
  completed: { label: 'Concluído', color: 'bg-green-500', icon: FaCheckCircle },
  next: { label: 'Próximo', color: 'bg-amber-500', icon: FaBook },
};

export function Reading() {
  return (
    <section className="py-20 bg-white dark:bg-dark-bg">
      <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 rounded-full text-sm font-medium mb-4">
            <FaBook /> Base de Conhecimento
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Leituras de Desenvolvimento 📚
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto text-sm">
            Livros que estou estudando para aprimorar minhas habilidades e me manter atualizado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {books.map((book) => {
            const StatusIcon = statusConfig[book.status].icon;
            return (
              <div
                key={book.id}
                className="group bg-gray-50 dark:bg-dark-card rounded-2xl p-5 border border-gray-200 dark:border-dark-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative mb-4">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-lg group-hover:shadow-xl transition-shadow">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className={`absolute top-3 right-3 ${statusConfig[book.status].color} text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg`}>
                    <StatusIcon className="text-xs" />
                    {statusConfig[book.status].label}
                  </div>
                </div>

                <span className="inline-block text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full mb-2">
                  {book.category}
                </span>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">
                  {book.title}
                </h3>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {book.author}
                </p>

                {book.status === 'reading' && book.progress && (
                  <div className="mt-auto">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Progresso</span>
                      <span className="font-medium text-accent">{book.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${book.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            "O código limpo é simples e direto. O código limpo é lido como uma prosa bem escrita."
            <span className="block mt-1 text-accent font-medium">— Robert C. Martin</span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Reading;
