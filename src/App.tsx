import { lazy, Suspense, useEffect } from 'react';
import './i18n';
import { Layout } from './components/layout';
import { Hero, About, TechStack, Projects, Contact } from './components/sections';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async'; // Import Helmet

const supportedLanguages = new Set(['en', 'pt', 'de', 'zh']);

function getSafeLanguage(input?: string): string {
  const normalized = (input ?? '').toLowerCase().split('-')[0];
  if (!normalized || normalized === 'cimode') {
    return 'en';
  }
  return supportedLanguages.has(normalized) ? normalized : 'en';
}

// Lazy load heavy components
const Game3D = lazy(() => import('./components/sections/Game3D').then(m => ({ default: m.Game3D })));

function GameLoading() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-[#64748b]">{t('loading_game')}</div>
    </div>
  );
}

export default function App() {
  const { t, i18n } = useTranslation();
  const rawLanguage = i18n.resolvedLanguage ?? i18n.language;
  const currentLanguage = getSafeLanguage(rawLanguage);

  // If detector picks an unsupported/special language, normalize it immediately.
  useEffect(() => {
    if (rawLanguage !== currentLanguage) {
      i18n.changeLanguage(currentLanguage).catch(() => {
        // ignore language switch errors
      });
    }
  }, [rawLanguage, currentLanguage, i18n]);

  // Sync HTML lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  // Update localStorage when language changes
  useEffect(() => {
    const handleLanguageChanged = () => {
      const newLanguage = getSafeLanguage(i18n.resolvedLanguage ?? i18n.language);
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('lng', newLanguage);
        }
      } catch (err) {
        // ignore storage errors
      }
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  return (
    <>
      <Helmet>
        <html lang={currentLanguage} />
        <title>{t('portfolio_title')}</title>
        <meta name="description" content={t('description')} />
        <meta name="keywords" content={t('keywords')} />
        <meta property="og:title" content={t('og_title')} />
        <meta property="og:description" content={t('og_description')} />
        <meta name="twitter:title" content={t('twitter_title')} />
        <meta name="twitter:description" content={t('twitter_description')} />
      </Helmet>
      <Layout i18n={i18n}>
        <Hero />
        <About />
        <TechStack />
        <Projects />
        <Suspense fallback={<GameLoading />}>
          <Game3D />
        </Suspense>
        <Contact />
      </Layout>
    </>
  );
}
