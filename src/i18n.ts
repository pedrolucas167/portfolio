import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// Language detector for automatic browser/localStorage detection
// @ts-ignore: module may not have type declarations available in this repo
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en/translation.json';
import zh from './locales/zh/translation.json';
import de from './locales/de/translation.json';
import pt from './locales/pt/translation.json';

const supportedLngs = ['en', 'zh', 'de', 'pt'] as const;
const fallbackLanguage = 'en';

function normalizeLanguage(input?: string | null): (typeof supportedLngs)[number] | null {
  if (!input) {
    return null;
  }

  const languageOnly = input.toLowerCase().split('-')[0];

  // Never allow i18next key-debug mode in production UI.
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
    // ignore storage access errors
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
  .use(initReactI18next) // passes i18n down to react-i18next
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
    },
    lng: getInitialLanguage(),
    supportedLngs,
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    // detection options: try localStorage first, then browser navigator
    detection: {
      // order and from where user language should be detected
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      // keys to lookup language from
      lookupLocalStorage: 'lng',
      // cache user language on
      caches: ['localStorage'],
      excludeCacheFor: ['cimode'],
    },
    // fallback language if translation is missing or detection fails
    fallbackLng: fallbackLanguage,

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
