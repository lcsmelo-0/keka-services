export const TODO_COLUMN_IDS = {
  doing: 'doing',
  done: 'done',
  todo: 'todo',
};

export const TODO_PRIORITY_IDS = {
  high: 'high',
  low: 'low',
  medium: 'medium',
};

export const TODO_PRIORITIES = [
  {
    id: TODO_PRIORITY_IDS.low,
    translationKey: 'low',
  },
  {
    id: TODO_PRIORITY_IDS.medium,
    translationKey: 'medium',
  },
  {
    id: TODO_PRIORITY_IDS.high,
    translationKey: 'high',
  },
];

export const TODO_COLUMNS = [
  {
    id: TODO_COLUMN_IDS.todo,
    translationKey: 'todo',
  },
  {
    id: TODO_COLUMN_IDS.doing,
    translationKey: 'doing',
  },
  {
    id: TODO_COLUMN_IDS.done,
    translationKey: 'done',
  },
];

export const TODO_VIEW_MODES = {
  board: 'board',
  list: 'list',
};

export const createTodoTask = ({
  description = '',
  priority = TODO_PRIORITY_IDS.medium,
  status = TODO_COLUMN_IDS.todo,
  title,
}) => {
  const createdAt = Date.now();

  return {
    createdAt,
    description: description.trim(),
    id: `todo-${createdAt}-${Math.random().toString(36).slice(2, 9)}`,
    priority,
    status,
    title: title.trim(),
    updatedAt: createdAt,
  };
};
