import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './langs/en.json';
import vi from './langs/vi.json';

// ----------------------------------------------------------------------

export const defaultLang = 'en';

export const allLangs = [
  {
    value: 'en',
    label: 'English',
    icon: '/assets/icons/flags/ic-flag-en.svg',
  },
  {
    value: 'vi',
    label: 'Tiếng Việt',
    icon: '/assets/icons/flags/ic-flag-vi.svg',
  },
];

// ----------------------------------------------------------------------

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi },
    },
    lng: undefined, // Allow LanguageDetector to set this
    fallbackLng: defaultLang,
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
