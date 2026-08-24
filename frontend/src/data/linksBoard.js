export const createLinkGroup = (title) => {
  const createdAt = Date.now();

  return {
    createdAt,
    id: `group-${createdAt}-${Math.random().toString(36).slice(2, 9)}`,
    title: title.trim(),
    updatedAt: createdAt,
  };
};

export const createLinkItem = ({ groupId = null, title, url }) => {
  const createdAt = Date.now();

  return {
    createdAt,
    groupId,
    id: `link-${createdAt}-${Math.random().toString(36).slice(2, 9)}`,
    title: title.trim(),
    updatedAt: createdAt,
    url: url.trim(),
  };
};

export const isValidLinkUrl = (value) => {
  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
};
