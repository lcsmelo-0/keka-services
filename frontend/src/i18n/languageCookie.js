const COOKIE_MAX_AGE_DAYS = 365;
const COOKIE_NAME = 'keka_services_language';

export const getLanguageFromCookie = () => {
  if (typeof document === 'undefined') {
    return '';
  }

  const cookieMatch = document.cookie.match(
    new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`),
  );

  if (!cookieMatch) {
    return '';
  }

  return decodeURIComponent(cookieMatch[1]);
};

export const saveLanguageToCookie = (language) => {
  if (!language || typeof document === 'undefined') {
    return;
  }

  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;

  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(language)}; max-age=${maxAge}; path=/; SameSite=Lax`;
};
