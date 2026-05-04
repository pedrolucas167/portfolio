import { lazy, Suspense } from 'react';
import { Layout } from './components/layout';
import { Hero, About, TechStack, Projects, Contact } from './components/sections';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async'; // Import Helmet

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

  return (
    <>
      <Helmet>
        <html lang={i18n.language} />
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
