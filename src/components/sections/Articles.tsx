import { FaExternalLinkAlt, FaMedium } from 'react-icons/fa';
import { articles as fallbackArticles } from '../../data';
import { GlassCard, SectionWrapper } from '../ui';
import { useReveal } from '../../hooks/useReveal';
import { useTranslation } from 'react-i18next';
import { useMediumArticles, DynamicArticle } from '../../hooks/useMediumArticles';

const MEDIUM_USERNAME = 'preluramos';

export function Articles() {
  const { t } = useTranslation();
  const { ref, isRevealed } = useReveal({ threshold: 0.1 });
  const { dynamicArticles, loading } = useMediumArticles(MEDIUM_USERNAME);

  const displayArticles: DynamicArticle[] = dynamicArticles ?? fallbackArticles.map(a => ({
    ...a,
    title: t(a.titleKey),
    description: t(a.descriptionKey),
  }));

  return (
    <SectionWrapper id="artigos">
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`transition-all duration-1000 ${isRevealed ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="text-center mb-8 sm:mb-10">
          <span className="badge-premium secondary mb-3 sm:mb-4 inline-block">{t('articles_badge')}</span>
          <h2 className="section-title mb-3 sm:mb-4">
            {t('articles_title_part1')}{' '}
            <span className="text-gradient-animated">{t('articles_title_part2')}</span>
          </h2>
          <p className="section-subtitle mx-auto px-2 sm:px-0">
            {t('articles_subtitle')}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card-subtle rounded-2xl overflow-hidden animate-pulse">
                <div className="h-28 sm:h-32 bg-white/5" />
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-full" />
                  <div className="h-3 bg-white/5 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {displayArticles.map((article, index) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block focus:outline-none"
              >
                <GlassCard
                  tilt
                  className={`h-full transition-all duration-700 ${
                    isRevealed
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` } as React.CSSProperties}
                >
                  <div className={`h-28 sm:h-32 bg-gradient-to-br ${article.gradient} relative overflow-hidden`}>
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                        backgroundSize: '20px 20px',
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl sm:text-6xl transform group-hover:scale-110 transition-transform duration-500">
                        {article.emoji}
                      </span>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="badge-premium bg-black/30 backdrop-blur-sm border-white/20 text-white text-xs">
                        {article.tag}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="flex items-center gap-1 text-[10px] sm:text-xs text-white/70 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                        {article.readingTime}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-medium flex items-center gap-2 text-sm">
                        {t('articles_read_on_medium')} <FaExternalLinkAlt className="text-xs" />
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-[var(--color-accent)] transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-[#94a3b8] text-xs sm:text-sm line-clamp-2 leading-relaxed">
                      {article.description}
                    </p>
                  </div>
                </GlassCard>
              </a>
            ))}
          </div>
        )}

        <div className="mt-8 sm:mt-10 text-center">
          <a
            href={`https://medium.com/@${MEDIUM_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-premium btn-secondary-premium inline-flex"
          >
            <FaMedium className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{t('articles_view_all')}</span>
          </a>
        </div>
      </div>
    </SectionWrapper>
  );
}
