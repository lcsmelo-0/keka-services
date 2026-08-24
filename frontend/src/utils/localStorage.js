export const readLocalStorageJson = (key, fallback) => {
  if (typeof localStorage === 'undefined') {
    return fallback;
  }

  try {
    const storedValue = localStorage.getItem(key);

    if (!storedValue) {
      return fallback;
    }

    return JSON.parse(storedValue);
  } catch {
    return fallback;
  }
};

export const writeLocalStorageJson = (key, value) => {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
};
