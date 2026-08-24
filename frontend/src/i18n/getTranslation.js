import { en } from './translations/en';
import { es } from './translations/es';
import { ptBR } from './translations/pt-BR';

const translationsByLanguage = {
  en,
  es,
  'pt-BR': ptBR,
};

export const getTranslation = (language, key, params = {}) => {
  const translations = translationsByLanguage[language] ?? translationsByLanguage.en;
  const translationValue = key.split('.').reduce((currentValue, part) => {
    if (!currentValue) {
      return undefined;
    }

    return currentValue[part];
  }, translations);

  if (typeof translationValue !== 'string') {
    return key;
  }

  return Object.entries(params).reduce((result, [paramKey, paramValue]) => {
    return result.replace(`{{${paramKey}}}`, String(paramValue));
  }, translationValue);
};

export const toTranslationKey = (value) => {
  return value.replace(/-([a-z])/g, (_, character) => {
    return character.toUpperCase();
  });
};

export const getServiceTranslation = (translate, serviceId, field) => {
  const serviceKey = toTranslationKey(serviceId);

  return translate(`services.${serviceKey}.${field}`);
};

export const getServiceTemplateTranslation = (translate, templateId) => {
  const templateKey = toTranslationKey(templateId);

  return translate(`serviceTemplates.${templateKey}`);
};
