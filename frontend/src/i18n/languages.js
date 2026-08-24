export const DEFAULT_LANGUAGE = 'en';

export const LANGUAGES = {
  en: {
    flag: '🇺🇸',
    id: 'en',
    label: 'English',
  },
  es: {
    flag: '🇪🇸',
    id: 'es',
    label: 'Español',
  },
  ptBR: {
    flag: '🇧🇷',
    id: 'pt-BR',
    label: 'Português (BR)',
  },
};

export const LANGUAGE_OPTIONS = Object.values(LANGUAGES);

export const getValidatedLanguage = (language) => {
  const matchedLanguage = LANGUAGE_OPTIONS.find((languageOption) => {
    return languageOption.id === language;
  });

  if (matchedLanguage) {
    return matchedLanguage.id;
  }

  return DEFAULT_LANGUAGE;
};

export const getLanguageOptionById = (languageId) => {
  return LANGUAGE_OPTIONS.find((languageOption) => {
    return languageOption.id === languageId;
  });
};
