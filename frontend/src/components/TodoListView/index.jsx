import { TODO_COLUMNS, TODO_PRIORITIES, TODO_PRIORITY_IDS } from '../../data/todoBoard';
import './TodoListView.css';

const PRIORITY_ORDER = {
  [TODO_PRIORITY_IDS.high]: 0,
  [TODO_PRIORITY_IDS.medium]: 1,
  [TODO_PRIORITY_IDS.low]: 2,
};

export const TodoListView = ({
  emptyLabel,
  getColumnLabel,
  getPriorityLabel,
  onDelete,
  onEdit,
  onPriorityChange,
  onStatusChange,
  tasks,
}) => {
  if (tasks.length === 0) {
    return <p className="todo-list-view__empty">{emptyLabel}</p>;
  }

  const sortedTasks = [...tasks].sort((taskA, taskB) => {
    const columnOrder = TODO_COLUMNS.map((column) => {
      return column.id;
    });
    const statusDiff =
      columnOrder.indexOf(taskA.status) - columnOrder.indexOf(taskB.status);

    if (statusDiff !== 0) {
      return statusDiff;
    }

    const priorityA = taskA.priority || TODO_PRIORITY_IDS.medium;
    const priorityB = taskB.priority || TODO_PRIORITY_IDS.medium;
    const priorityDiff = PRIORITY_ORDER[priorityA] - PRIORITY_ORDER[priorityB];

    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    return taskB.updatedAt - taskA.updatedAt;
  });

  return (
    <ul className="todo-list-view">
      {sortedTasks.map((task) => {
        const priority = task.priority || TODO_PRIORITY_IDS.medium;

        return (
          <li className="todo-list-view__item" key={task.id}>
            <div className="todo-list-view__main">
              <span className={`todo-list-view__priority todo-list-view__priority--${priority}`}>
                {getPriorityLabel(priority)}
              </span>
              <h3 className="todo-list-view__title">{task.title}</h3>
              {task.description && (
                <p className="todo-list-view__description">{task.description}</p>
              )}
            </div>

            <div className="todo-list-view__meta">
              <select
                className="todo-list-view__status"
                onChange={(event) => {
                  onPriorityChange(task.id, event.target.value);
                }}
                value={priority}
              >
                {TODO_PRIORITIES.map((priorityOption) => {
                  return (
                    <option key={priorityOption.id} value={priorityOption.id}>
                      {getPriorityLabel(priorityOption.translationKey)}
                    </option>
                  );
                })}
              </select>

              <select
                className="todo-list-view__status"
                onChange={(event) => {
                  onStatusChange(task.id, event.target.value);
                }}
                value={task.status}
              >
                {TODO_COLUMNS.map((column) => {
                  return (
                    <option key={column.id} value={column.id}>
                      {getColumnLabel(column.translationKey)}
                    </option>
                  );
                })}
              </select>

              <button
                className="todo-list-view__action"
                onClick={() => {
                  onEdit(task);
                }}
                type="button"
              >
                ✎
              </button>
              <button
                className="todo-list-view__action todo-list-view__action--danger"
                onClick={() => {
                  onDelete(task.id);
                }}
                type="button"
              >
                ×
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
