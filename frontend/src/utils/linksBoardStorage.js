import { readLocalStorageJson, writeLocalStorageJson } from './localStorage';

const LINKS_BOARD_STORAGE_KEY = 'keka-services.links-board';

export const loadLinksBoard = () => {
  const storedBoard = readLocalStorageJson(LINKS_BOARD_STORAGE_KEY, {
    groups: [],
    links: [],
  });

  return {
    groups: Array.isArray(storedBoard?.groups) ? storedBoard.groups : [],
    links: Array.isArray(storedBoard?.links) ? storedBoard.links : [],
  };
};

export const saveLinksBoard = ({ groups, links }) => {
  writeLocalStorageJson(LINKS_BOARD_STORAGE_KEY, {
    groups,
    links,
  });
};
