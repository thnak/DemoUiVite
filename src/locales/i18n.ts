import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './langs/en.json';
import vi from './langs/vi.json';

// ----------------------------------------------------------------------

export const defaultLang = 'en-US';

export const allLangs = [
  {
    value: 'en-US',
    label: 'English',
    icon: '/assets/icons/flags/ic-flag-en.svg',
  },
  {
    value: 'vi-VN',
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
      'en-US': { translation: en },
      'vi-VN': { translation: vi },
      // Fallback for short codes
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

// Make i18n accessible globally for translation worker
if (typeof window !== 'undefined') {
  (window as any).i18n = i18n;
}

export default i18n;
