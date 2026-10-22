import { Chatbot } from '../features/chat/components/Chatbot';
import { Contact } from '../features/contact/components/Contact';
import { Articles } from '../features/articles/components/Articles';
import { lazy, Suspense, useEffect } from 'react';
import { normalizeLanguage, fallbackLanguage } from './i18n';
import { Layout } from '../components/layout';
import { Hero, About, TechStack, Projects } from '../components/sections';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

const Game = lazy(() => import('../features/game/Game'));

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
  const currentLanguage = normalizeLanguage(rawLanguage) ?? fallbackLanguage;

  useEffect(() => {
    if (rawLanguage !== currentLanguage) {
      i18n.changeLanguage(currentLanguage).catch(() => {});
    }
  }, [rawLanguage, currentLanguage, i18n]);

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);


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
      <Layout>
        <Hero />
        <About />
        <TechStack />
        <Projects />
        <Articles />
        <Suspense fallback={<GameLoading />}>
          <Game />
        </Suspense>
        <Contact />
        <Chatbot />
      </Layout>
    </>
  );
}
