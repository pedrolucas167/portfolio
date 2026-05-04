import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import en from './locales/en/translation.json';
import zh from './locales/zh/translation.json';
import de from './locales/de/translation.json';
import pt from './locales/pt/translation.json';

i18n
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
    lng: 'pt', // default language
    fallbackLng: 'en', // fallback language if translation is missing

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
