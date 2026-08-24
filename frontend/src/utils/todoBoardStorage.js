import { readLocalStorageJson, writeLocalStorageJson } from './localStorage';

const TODOS_STORAGE_KEY = 'keka-services.todos';

export const loadTodos = () => {
  const storedTodos = readLocalStorageJson(TODOS_STORAGE_KEY, []);

  if (!Array.isArray(storedTodos)) {
    return [];
  }

  return storedTodos;
};

export const saveTodos = (todos) => {
  writeLocalStorageJson(TODOS_STORAGE_KEY, todos);
};
