import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TODO_PRIORITY_IDS } from '../../data/todoBoard';
import './TodoCard.css';

const getPriorityClassName = (priority) => {
  if (priority === TODO_PRIORITY_IDS.high) {
    return 'todo-card__priority todo-card__priority--high';
  }

  if (priority === TODO_PRIORITY_IDS.low) {
    return 'todo-card__priority todo-card__priority--low';
  }

  return 'todo-card__priority todo-card__priority--medium';
};

const TodoCardContent = ({
  getPriorityLabel,
  handleAttributes,
  handleListeners,
  onDelete,
  onEdit,
  task,
}) => {
  const priority = task.priority || TODO_PRIORITY_IDS.medium;

  return (
    <>
      <button
        aria-label="Drag"
        className="todo-card__handle"
        type="button"
        {...handleAttributes}
        {...handleListeners}
      >
        ⠿
      </button>

      <div className="todo-card__body">
        <span className={getPriorityClassName(priority)}>
          {getPriorityLabel(priority)}
        </span>
        <h3 className="todo-card__title">{task.title}</h3>
        {task.description && (
          <p className="todo-card__description">{task.description}</p>
        )}
      </div>

      <div className="todo-card__actions">
        <button
          className="todo-card__action"
          onClick={() => {
            onEdit(task);
          }}
          type="button"
        >
          ✎
        </button>
        <button
          className="todo-card__action todo-card__action--danger"
          onClick={() => {
            onDelete(task.id);
          }}
          type="button"
        >
          ×
        </button>
      </div>
    </>
  );
};

export const TodoCardOverlay = ({ getPriorityLabel, task }) => {
  const priority = task.priority || TODO_PRIORITY_IDS.medium;

  return (
    <article className="todo-card todo-card--overlay">
      <span className="todo-card__handle">⠿</span>
      <div className="todo-card__body">
        <span className={getPriorityClassName(priority)}>
          {getPriorityLabel(priority)}
        </span>
        <h3 className="todo-card__title">{task.title}</h3>
        {task.description && (
          <p className="todo-card__description">{task.description}</p>
        )}
      </div>
    </article>
  );
};

export const TodoCard = ({ getPriorityLabel, onDelete, onEdit, task }) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    data: {
      status: task.status,
      type: 'task',
    },
    id: task.id,
  });

  const style = {
    opacity: isDragging ? 0.4 : 1,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      className={`todo-card ${isDragging ? 'todo-card--dragging' : ''}`}
      ref={setNodeRef}
      style={style}
    >
      <TodoCardContent
        getPriorityLabel={getPriorityLabel}
        handleAttributes={attributes}
        handleListeners={listeners}
        onDelete={onDelete}
        onEdit={onEdit}
        task={task}
      />
    </article>
  );
};
