
import { useState } from 'react';
import { Task } from '@/types/task';
import { RecurringTask } from '@/types/recurring-task';

export function useTaskForms() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingRecurringTask, setEditingRecurringTask] = useState<RecurringTask | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyTask, setHistoryTask] = useState<RecurringTask | null>(null);
  
  const handleAddTask = () => {
    setEditingTask(null);
    setEditingRecurringTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditingRecurringTask(null);
    setIsFormOpen(true);
  };

  const handleEditRecurringTask = (task: RecurringTask) => {
    setEditingTask(null);
    setEditingRecurringTask(task);
    setIsFormOpen(true);
  };
  
  const handleViewTaskHistory = (taskId: string) => {
    return (recurringTasks: RecurringTask[]) => {
      const task = recurringTasks.find(t => t.id === taskId);
      if (task) {
        setHistoryTask(task);
        setIsHistoryOpen(true);
      }
    };
  };
  
  return {
    isFormOpen,
    setIsFormOpen,
    editingTask,
    editingRecurringTask,
    isHistoryOpen, 
    setIsHistoryOpen,
    historyTask,
    handleAddTask,
    handleEditTask,
    handleEditRecurringTask,
    handleViewTaskHistory
  };
}
