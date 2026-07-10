import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { DEFAULT_LANGUAGE, getValidatedLanguage } from './languages';
import { getLanguageFromCookie, saveLanguageToCookie } from './languageCookie';
import { getTranslation } from './getTranslation';

const LanguageContext = createContext(null);

const getInitialLanguage = () => {
  const storedLanguage = getLanguageFromCookie();

  if (storedLanguage) {
    return getValidatedLanguage(storedLanguage);
  }

  return DEFAULT_LANGUAGE;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(getInitialLanguage);

  const handleLanguageChange = useCallback((nextLanguage) => {
    const validatedLanguage = getValidatedLanguage(nextLanguage);

    setLanguage(validatedLanguage);
    saveLanguageToCookie(validatedLanguage);
  }, []);

  useLayoutEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    saveLanguageToCookie(language);
  }, [language]);

  const translate = useCallback(
    (key, params) => {
      return getTranslation(language, key, params);
    },
    [language],
  );

  const contextValue = useMemo(() => {
    return {
      language,
      setLanguage: handleLanguageChange,
      t: translate,
    };
  }, [handleLanguageChange, language, translate]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useTranslation must be used within LanguageProvider');
  }

  return context;
};
