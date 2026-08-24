import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TodoCard } from '../TodoCard';
import './TodoColumn.css';

export const TodoColumn = ({ column, emptyLabel, getPriorityLabel, onDelete, onEdit, tasks, title }) => {
  const { isOver, setNodeRef } = useDroppable({
    data: {
      status: column.id,
      type: 'column',
    },
    id: column.id,
  });

  const taskIds = tasks.map((task) => {
    return task.id;
  });

  return (
    <section
      className={`todo-column ${isOver ? 'todo-column--over' : ''} todo-column--${column.id}`}
      ref={setNodeRef}
    >
      <header className="todo-column__header">
        <h2 className="todo-column__title">{title}</h2>
        <span className="todo-column__count">{tasks.length}</span>
      </header>

      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="todo-column__list">
          {tasks.map((task) => {
            return (
              <TodoCard
                getPriorityLabel={getPriorityLabel}
                key={task.id}
                onDelete={onDelete}
                onEdit={onEdit}
                task={task}
              />
            );
          })}

          {tasks.length === 0 && (
            <p className="todo-column__empty">{emptyLabel}</p>
          )}
        </div>
      </SortableContext>
    </section>
  );
};
