
import React from 'react';
import { TaskForm } from '@/components/TaskForm';
import { TaskHistoryModal } from '@/components/TaskHistoryModal';
import { FocusMode } from '@/components/FocusMode';
import { Task } from '@/types/task';
import { RecurringTask, RecurringTaskEntry } from '@/types/recurring-task';

interface TasksPageModalsProps {
  forms: {
    isFormOpen: boolean;
    setIsFormOpen: (isOpen: boolean) => void;
    editingTask: Task | null;
    editingRecurringTask: RecurringTask | null;
  };
  history: {
    isHistoryOpen: boolean;
    setIsHistoryOpen: (isOpen: boolean) => void;
    historyTask: RecurringTask | null;
    getEntriesForTask: (taskId: string) => RecurringTaskEntry[];
  };
  focus: {
    focusTask: { type: 'regular' | 'recurring'; task: Task | RecurringTask } | null;
    isFocusModeOpen: boolean;
    setIsFocusModeOpen: (isOpen: boolean) => void;
    onCompleteTask: (id: string) => void;
    onCompleteRecurringTask: (entry: RecurringTaskEntry) => void;
  };
  onSaveTask: (task: Task) => void;
  onSaveRecurringTask: (task: RecurringTask) => void;
  categories: string[];
  onAddCategory: (category: string) => void;
  categoryColors: Record<string, string>;
}

export function TasksPageModals({
  forms,
  history,
  focus,
  onSaveTask,
  onSaveRecurringTask,
  categories,
  onAddCategory,
  categoryColors
}: TasksPageModalsProps) {
  return (
    <>
      <TaskForm 
        isOpen={forms.isFormOpen}
        onClose={() => forms.setIsFormOpen(false)}
        onSaveTask={onSaveTask}
        onSaveRecurringTask={onSaveRecurringTask}
        editTask={forms.editingTask}
        editRecurringTask={forms.editingRecurringTask}
        categories={categories}
        onAddCategory={onAddCategory}
      />
      
      <TaskHistoryModal
        isOpen={history.isHistoryOpen}
        onClose={() => history.setIsHistoryOpen(false)}
        task={history.historyTask}
        entries={history.historyTask ? history.getEntriesForTask(history.historyTask.id) : []}
      />
      
      <FocusMode
        selectedTask={focus.focusTask}
        isOpen={focus.isFocusModeOpen}
        onClose={() => focus.setIsFocusModeOpen(false)}
        onCompleteTask={focus.onCompleteTask}
        onCompleteRecurringTask={focus.onCompleteRecurringTask}
        categoryColors={categoryColors}
      />
    </>
  );
}
