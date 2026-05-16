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
    },
    // fallback language if translation is missing or detection fails
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
