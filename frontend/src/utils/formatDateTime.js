export const formatDateTime = (timestamp, language = 'en') => {
  if (!timestamp) {
    return '';
  }

  return new Intl.DateTimeFormat(language, {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(timestamp));
};
