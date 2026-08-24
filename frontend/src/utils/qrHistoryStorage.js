import { readLocalStorageJson, writeLocalStorageJson } from './localStorage';

export const MAX_QR_HISTORY_ENTRIES = 100;
const QR_HISTORY_STORAGE_KEY = 'keka-services.qr-history';

export const createQrHistoryEntry = (value) => {
  const createdAt = Date.now();

  return {
    createdAt,
    id: `qr-${createdAt}-${Math.random().toString(36).slice(2, 9)}`,
    value: value.trim(),
  };
};

export const loadQrHistory = () => {
  const storedEntries = readLocalStorageJson(QR_HISTORY_STORAGE_KEY, []);

  if (!Array.isArray(storedEntries)) {
    return [];
  }

  return storedEntries;
};

export const saveQrHistory = (entries) => {
  writeLocalStorageJson(QR_HISTORY_STORAGE_KEY, entries.slice(0, MAX_QR_HISTORY_ENTRIES));
};
