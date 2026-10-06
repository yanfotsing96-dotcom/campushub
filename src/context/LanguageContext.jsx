/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { TRANSLATIONS, SUPPORTED_LANGUAGES } from '../i18n/translations';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'campushub_language';

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === 'fr' || saved === 'en')) {
        return saved;
      }
      // Check browser language
      const browserLang = navigator.language?.toLowerCase();
      if (browserLang && browserLang.startsWith('en')) {
        return 'en';
      }
      return 'fr';
    } catch {
      return 'fr';
    }
  });

  const setLanguage = useCallback((newLang) => {
    if (newLang === 'fr' || newLang === 'en') {
      setLanguageState(newLang);
      try {
        localStorage.setItem(STORAGE_KEY, newLang);
      } catch (err) {
        console.warn('Erreur stockage langue :', err);
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const currentLanguage = useMemo(() => {
    return (
      SUPPORTED_LANGUAGES.find((l) => l.code === language) ||
      SUPPORTED_LANGUAGES[0]
    );
  }, [language]);

  // Translation resolver with dot notation (e.g. 'nav.resources')
  const t = useCallback(
    (keyPath, fallback = '') => {
      const keys = keyPath.split('.');
      let current = TRANSLATIONS[language];

      for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
          current = current[k];
        } else {
          // Fallback to French if missing in current language
          let fallbackVal = TRANSLATIONS.fr;
          for (const fbKey of keys) {
            if (fallbackVal && typeof fallbackVal === 'object' && fbKey in fallbackVal) {
              fallbackVal = fallbackVal[fbKey];
            } else {
              return fallback || keyPath;
            }
          }
          return fallbackVal || fallback || keyPath;
        }
      }

      return current || fallback || keyPath;
    },
    [language]
  );

  const contextValue = useMemo(() => {
    return {
      language,
      setLanguage,
      currentLanguage,
      supportedLanguages: SUPPORTED_LANGUAGES,
      t,
    };
  }, [language, setLanguage, currentLanguage, t]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
