const books = [
  { title: 'Clean Code', author: 'Robert C. Martin', progress: 65 },
  { title: 'Desenvolvimento Real de Software', author: 'Urma & Warburton', progress: 40 },
  { title: 'Learning Domain-Driven Design', author: 'Vlad Khononov', progress: 0 },
];

export function Reading() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-dark-card">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Leituras 📚
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {books.map((book, i) => (
            <div key={i} className="bg-white dark:bg-dark-bg rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{book.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{book.author}</p>
              {book.progress > 0 ? (
                <div className="h-2 bg-gray-200 dark:bg-dark-border rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: `${book.progress}%` }} />
                </div>
              ) : (
                <span className="text-xs text-amber-500">Próximo</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
