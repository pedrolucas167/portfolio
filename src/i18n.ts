import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/translation.json';
import zh from './locales/zh/translation.json';
import de from './locales/de/translation.json';
import pt from './locales/pt/translation.json';
import es from './locales/es/translation.json';

const supportedLngs = ['en', 'zh', 'de', 'pt', 'es'] as const;
const fallbackLanguage = 'pt';

function normalizeLanguage(input?: string | null): (typeof supportedLngs)[number] | null {
  if (!input) {
    return null;
  }

  const languageOnly = input.toLowerCase().split('-')[0];

  if (languageOnly === 'cimode') {
    return fallbackLanguage;
  }

  return (supportedLngs as readonly string[]).includes(languageOnly)
    ? (languageOnly as (typeof supportedLngs)[number])
    : null;
}

function getInitialLanguage(): (typeof supportedLngs)[number] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const fromStorage = normalizeLanguage(window.localStorage.getItem('lng'));
      if (fromStorage) {
        return fromStorage;
      }
    }
  } catch {
  }

  if (typeof navigator !== 'undefined') {
    const fromNavigator = normalizeLanguage(navigator.language);
    if (fromNavigator) {
      return fromNavigator;
    }
  }

  return fallbackLanguage;
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      zh: {
        translation: zh,
      },
      de: {
        translation: de,
      },
      pt: {
        translation: pt,
      },
      es: {
        translation: es,
      },
    },
    lng: getInitialLanguage(),
    supportedLngs,
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      lookupLocalStorage: 'lng',
      caches: ['localStorage'],
      excludeCacheFor: ['cimode'],
    },
    fallbackLng: fallbackLanguage,

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
