const COOKIE_MAX_AGE_DAYS = 365;
const COOKIE_NAME = 'invoice_generator_last_number';

export const getInvoiceNumberFromCookie = () => {
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

export const saveInvoiceNumberToCookie = (invoiceNumber) => {
  if (!invoiceNumber || typeof document === 'undefined') {
    return;
  }

  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;

  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(invoiceNumber)}; max-age=${maxAge}; path=/; SameSite=Lax`;
};
