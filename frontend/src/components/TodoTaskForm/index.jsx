import { useEffect, useState } from 'react';
import { TODO_COLUMNS, TODO_PRIORITIES, TODO_PRIORITY_IDS } from '../../data/todoBoard';
import './TodoTaskForm.css';

const createEmptyForm = () => {
  return {
    description: '',
    priority: TODO_PRIORITY_IDS.medium,
    status: TODO_COLUMNS[0].id,
    title: '',
  };
};

export const TodoTaskForm = ({
  cancelLabel,
  descriptionLabel,
  descriptionPlaceholder,
  errorMessage,
  getColumnLabel,
  getPriorityLabel,
  initialTask,
  onCancel,
  onSubmit,
  priorityLabel,
  saveLabel,
  statusLabel,
  titleLabel,
  titlePlaceholder,
}) => {
  const [formValues, setFormValues] = useState(() => {
    if (!initialTask) {
      return createEmptyForm();
    }

    return {
      description: initialTask.description,
      priority: initialTask.priority || TODO_PRIORITY_IDS.medium,
      status: initialTask.status,
      title: initialTask.title,
    };
  });

  useEffect(() => {
    if (!initialTask) {
      setFormValues(createEmptyForm());
      return;
    }

    setFormValues({
      description: initialTask.description,
      priority: initialTask.priority || TODO_PRIORITY_IDS.medium,
      status: initialTask.status,
      title: initialTask.title,
    });
  }, [initialTask]);

  const handleChange = (field) => {
    return (event) => {
      setFormValues((currentValues) => {
        return {
          ...currentValues,
          [field]: event.target.value,
        };
      });
    };
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formValues);
  };

  return (
    <form className="todo-task-form" onSubmit={handleSubmit}>
      <div className="todo-task-form__field">
        <label className="todo-task-form__label" htmlFor="todo-task-title">
          {titleLabel}
        </label>
        <input
          autoFocus
          className="todo-task-form__input"
          id="todo-task-title"
          onChange={handleChange('title')}
          placeholder={titlePlaceholder}
          type="text"
          value={formValues.title}
        />
      </div>

      <div className="todo-task-form__field">
        <label className="todo-task-form__label" htmlFor="todo-task-description">
          {descriptionLabel}
        </label>
        <textarea
          className="todo-task-form__input todo-task-form__textarea"
          id="todo-task-description"
          onChange={handleChange('description')}
          placeholder={descriptionPlaceholder}
          rows={3}
          value={formValues.description}
        />
      </div>

      <div className="todo-task-form__field">
        <label className="todo-task-form__label" htmlFor="todo-task-priority">
          {priorityLabel}
        </label>
        <select
          className="todo-task-form__input"
          id="todo-task-priority"
          onChange={handleChange('priority')}
          value={formValues.priority}
        >
          {TODO_PRIORITIES.map((priority) => {
            return (
              <option key={priority.id} value={priority.id}>
                {getPriorityLabel(priority.translationKey)}
              </option>
            );
          })}
        </select>
      </div>

      <div className="todo-task-form__field">
        <label className="todo-task-form__label" htmlFor="todo-task-status">
          {statusLabel}
        </label>
        <select
          className="todo-task-form__input"
          id="todo-task-status"
          onChange={handleChange('status')}
          value={formValues.status}
        >
          {TODO_COLUMNS.map((column) => {
            return (
              <option key={column.id} value={column.id}>
                {getColumnLabel(column.translationKey)}
              </option>
            );
          })}
        </select>
      </div>

      {errorMessage && <p className="todo-task-form__error">{errorMessage}</p>}

      <div className="todo-task-form__actions">
        <button className="todo-task-form__button" onClick={onCancel} type="button">
          {cancelLabel}
        </button>
        <button
          className="todo-task-form__button todo-task-form__button--primary"
          type="submit"
        >
          {saveLabel}
        </button>
      </div>
    </form>
  );
};
