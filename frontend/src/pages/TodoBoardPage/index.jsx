import {
  closestCorners,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TodoCardOverlay } from '../../components/TodoCard';
import { TodoColumn } from '../../components/TodoColumn';
import { TodoListView } from '../../components/TodoListView';
import { TodoTaskForm } from '../../components/TodoTaskForm';
import {
  createTodoTask,
  TODO_COLUMNS,
  TODO_VIEW_MODES,
} from '../../data/todoBoard';
import { useTranslation } from '../../i18n/LanguageProvider';
import { loadTodos, saveTodos } from '../../utils/todoBoardStorage';
import './TodoBoardPage.css';

export const TodoBoardPage = () => {
  const { t } = useTranslation();
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [tasks, setTasks] = useState(() => {
    return loadTodos();
  });
  const [viewMode, setViewMode] = useState(TODO_VIEW_MODES.board);
  const tasksRef = useRef(tasks);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  useEffect(() => {
    saveTodos(tasks);
  }, [tasks]);

  const activeTask = useMemo(() => {
    return tasks.find((task) => {
      return task.id === activeTaskId;
    });
  }, [activeTaskId, tasks]);

  const getColumnLabel = (translationKey) => {
    return t(`todoBoard.columns.${translationKey}`);
  };

  const getPriorityLabel = (translationKey) => {
    return t(`todoBoard.priorities.${translationKey}`);
  };

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => {
      return task.status === status;
    });
  };

  const handleOpenCreateForm = () => {
    setEditingTask(null);
    setErrorMessage('');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (task) => {
    setEditingTask(task);
    setErrorMessage('');
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingTask(null);
    setErrorMessage('');
    setIsFormOpen(false);
  };

  const handleSubmitForm = (formValues) => {
    const trimmedTitle = formValues.title.trim();

    if (!trimmedTitle) {
      setErrorMessage(t('todoBoard.titleRequired'));
      return;
    }

    if (editingTask) {
      setTasks((currentTasks) => {
        return currentTasks.map((task) => {
          if (task.id !== editingTask.id) {
            return task;
          }

          return {
            ...task,
            description: formValues.description.trim(),
            priority: formValues.priority,
            status: formValues.status,
            title: trimmedTitle,
            updatedAt: Date.now(),
          };
        });
      });
    } else {
      const newTask = createTodoTask({
        description: formValues.description,
        priority: formValues.priority,
        status: formValues.status,
        title: trimmedTitle,
      });

      setTasks((currentTasks) => {
        return [newTask, ...currentTasks];
      });
    }

    handleCloseForm();
  };

  const handleDeleteTask = (taskId) => {
    setTasks((currentTasks) => {
      return currentTasks.filter((task) => {
        return task.id !== taskId;
      });
    });
  };

  const handleStatusChange = (taskId, status) => {
    setTasks((currentTasks) => {
      return currentTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        return {
          ...task,
          status,
          updatedAt: Date.now(),
        };
      });
    });
  };

  const handlePriorityChange = (taskId, priority) => {
    setTasks((currentTasks) => {
      return currentTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        return {
          ...task,
          priority,
          updatedAt: Date.now(),
        };
      });
    });
  };

  const handleDragStart = (event) => {
    setActiveTaskId(String(event.active.id));
  };

  const handleDragOver = (event) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);
    const overData = over.data.current;

    setTasks((currentTasks) => {
      const draggedTask = currentTasks.find((task) => {
        return task.id === activeId;
      });

      if (!draggedTask) {
        return currentTasks;
      }

      const overStatus =
        overData?.type === 'column'
          ? overData.status
          : (overData?.status ??
            currentTasks.find((task) => {
              return task.id === overId;
            })?.status);

      if (!overStatus || draggedTask.status === overStatus) {
        return currentTasks;
      }

      return currentTasks.map((task) => {
        if (task.id !== activeId) {
          return task;
        }

        return {
          ...task,
          status: overStatus,
          updatedAt: Date.now(),
        };
      });
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setActiveTaskId(null);

    const currentTasks = tasksRef.current;

    if (!over) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);
    const overData = over.data.current;
    const draggedTask = currentTasks.find((task) => {
      return task.id === activeId;
    });

    if (!draggedTask) {
      return;
    }

    const overStatus =
      overData?.type === 'column'
        ? overData.status
        : (overData?.status ??
          currentTasks.find((task) => {
            return task.id === overId;
          })?.status);

    if (!overStatus) {
      return;
    }

    let nextTasks = currentTasks;

    if (draggedTask.status !== overStatus) {
      nextTasks = currentTasks.map((task) => {
        if (task.id !== activeId) {
          return task;
        }

        return {
          ...task,
          status: overStatus,
          updatedAt: Date.now(),
        };
      });
    } else if (activeId !== overId) {
      const columnTasks = currentTasks.filter((task) => {
        return task.status === draggedTask.status;
      });
      const oldIndex = columnTasks.findIndex((task) => {
        return task.id === activeId;
      });
      const newIndex = columnTasks.findIndex((task) => {
        return task.id === overId;
      });

      if (oldIndex >= 0 && newIndex >= 0 && oldIndex !== newIndex) {
        const reorderedColumnTasks = arrayMove(columnTasks, oldIndex, newIndex);
        const otherTasks = currentTasks.filter((task) => {
          return task.status !== draggedTask.status;
        });

        nextTasks = [...otherTasks, ...reorderedColumnTasks];
      }
    }

    setTasks(nextTasks);
  };

  return (
    <div className="todo-board-page">
      <header className="todo-board-page__header">
        <div className="todo-board-page__header-text">
          <h1 className="todo-board-page__title">{t('todoBoard.title')}</h1>
          <p className="todo-board-page__description">{t('todoBoard.description')}</p>
        </div>

        <div className="todo-board-page__header-actions">
          <div className="todo-board-page__view-toggle" role="group">
            <button
              className={`todo-board-page__view-button ${viewMode === TODO_VIEW_MODES.board ? 'todo-board-page__view-button--active' : ''}`}
              onClick={() => {
                setViewMode(TODO_VIEW_MODES.board);
              }}
              type="button"
            >
              {t('todoBoard.viewBoard')}
            </button>
            <button
              className={`todo-board-page__view-button ${viewMode === TODO_VIEW_MODES.list ? 'todo-board-page__view-button--active' : ''}`}
              onClick={() => {
                setViewMode(TODO_VIEW_MODES.list);
              }}
              type="button"
            >
              {t('todoBoard.viewList')}
            </button>
          </div>

          <button
            className="todo-board-page__add-button"
            onClick={handleOpenCreateForm}
            type="button"
          >
            {t('todoBoard.addTask')}
          </button>
        </div>
      </header>

      {isFormOpen && (
        <div className="todo-board-page__modal">
          <button
            aria-label={t('todoBoard.cancel')}
            className="todo-board-page__modal-overlay"
            onClick={handleCloseForm}
            type="button"
          />
          <div className="todo-board-page__modal-card">
            <h2 className="todo-board-page__modal-title">
              {editingTask ? t('todoBoard.editTask') : t('todoBoard.newTask')}
            </h2>
            <TodoTaskForm
              cancelLabel={t('todoBoard.cancel')}
              descriptionLabel={t('todoBoard.descriptionLabel')}
              descriptionPlaceholder={t('todoBoard.descriptionPlaceholder')}
              errorMessage={errorMessage}
              getColumnLabel={getColumnLabel}
              getPriorityLabel={getPriorityLabel}
              initialTask={editingTask}
              onCancel={handleCloseForm}
              onSubmit={handleSubmitForm}
              priorityLabel={t('todoBoard.priorityLabel')}
              saveLabel={t('todoBoard.save')}
              statusLabel={t('todoBoard.statusLabel')}
              titleLabel={t('todoBoard.titleLabel')}
              titlePlaceholder={t('todoBoard.titlePlaceholder')}
            />
          </div>
        </div>
      )}

      {viewMode === TODO_VIEW_MODES.board ? (
        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
          sensors={sensors}
        >
          <div className="todo-board-page__board">
            {TODO_COLUMNS.map((column) => {
              return (
                <TodoColumn
                  column={column}
                  emptyLabel={t('todoBoard.emptyColumn')}
                  getPriorityLabel={getPriorityLabel}
                  key={column.id}
                  onDelete={handleDeleteTask}
                  onEdit={handleOpenEditForm}
                  tasks={getTasksByStatus(column.id)}
                  title={getColumnLabel(column.translationKey)}
                />
              );
            })}
          </div>

          <DragOverlay>
            {activeTask ? (
              <TodoCardOverlay getPriorityLabel={getPriorityLabel} task={activeTask} />
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <TodoListView
          emptyLabel={t('todoBoard.emptyList')}
          getColumnLabel={getColumnLabel}
          getPriorityLabel={getPriorityLabel}
          onDelete={handleDeleteTask}
          onEdit={handleOpenEditForm}
          onPriorityChange={handlePriorityChange}
          onStatusChange={handleStatusChange}
          tasks={tasks}
        />
      )}
    </div>
  );
};
