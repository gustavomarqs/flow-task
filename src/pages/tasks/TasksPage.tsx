
import React from 'react';
import { TasksPageContent } from './TasksPageContent';
import { TasksPageModals } from './TasksPageModals';
import { useTasks } from '@/hooks/useTasks';
import { useRecurringTasks } from '@/hooks/useRecurringTasks';
import { useCategories } from '@/hooks/useCategories';
import { useTaskFilters } from '@/hooks/useTaskFilters';
import { useTaskForms } from '@/hooks/useTaskForms';
import { useFocusMode } from '@/hooks/useFocusMode';

export default function TasksPage() {
  // Hooks for task management
  const { 
    tasks, 
    handleAddTask, 
    handleUpdateTask,
    handleCompleteTask, 
    handleDeleteTask 
  } = useTasks();
  
  // Hooks for recurring tasks
  const { 
    recurringTasks, 
    taskEntries,
    handleAddRecurringTask, 
    handleUpdateRecurringTask,
    handleCompleteRecurringTask, 
    handleDeleteRecurringTask,
    getEntriesForTask,
    getTodaysEntries
  } = useRecurringTasks();
  
  // Categories management
  const { categories, categoryColors, handleAddCategory } = useCategories();
  
  // Task filtering
  const { 
    searchQuery, 
    setSearchQuery, 
    activeTab, 
    setActiveTab,
    filterTasks,
    filterRecurringTasks,
    handleCategoryClick
  } = useTaskFilters();
  
  // Form and modal state management
  const {
    isFormOpen,
    setIsFormOpen,
    editingTask,
    editingRecurringTask,
    isHistoryOpen,
    setIsHistoryOpen,
    historyTask,
    handleAddTask: openAddTaskForm,
    handleEditTask,
    handleEditRecurringTask,
    handleViewTaskHistory
  } = useTaskForms();
  
  // Focus mode
  const {
    focusTask,
    isFocusModeOpen,
    setIsFocusModeOpen,
    handleStartFocus,
    onCompleteTask,
    onCompleteRecurringTask
  } = useFocusMode(handleCompleteTask, handleCompleteRecurringTask);
  
  // Apply filters
  const filteredTasks = filterTasks(tasks);
  const filteredRecurringTasks = filterRecurringTasks(recurringTasks);

  return (
    <>
      <TasksPageContent 
        tasks={{
          activeTab,
          setActiveTab,
          categories,
          filteredTasks,
          filteredRecurringTasks,
          taskEntries: getTodaysEntries(),
          categoryColors,
          onCategoryClick: handleCategoryClick,
          onCompleteTask: handleCompleteTask,
          onEditTask: handleEditTask,
          onDeleteTask: handleDeleteTask,
          onCompleteRecurringTask: handleCompleteRecurringTask,
          onEditRecurringTask: handleEditRecurringTask,
          onDeleteRecurringTask: handleDeleteRecurringTask,
          onViewTaskHistory: (taskId) => handleViewTaskHistory(taskId)(recurringTasks),
          onStartFocus: handleStartFocus,
        }}
        search={{
          searchQuery,
          setSearchQuery
        }}
        onAddTask={openAddTaskForm}
        weeklyProgress={{
          entries: taskEntries,
          tasks,
          categories,
          categoryColors
        }}
      />
      
      <TasksPageModals
        forms={{
          isFormOpen,
          setIsFormOpen,
          editingTask,
          editingRecurringTask
        }}
        history={{
          isHistoryOpen,
          setIsHistoryOpen,
          historyTask,
          getEntriesForTask
        }}
        focus={{
          focusTask,
          isFocusModeOpen,
          setIsFocusModeOpen,
          onCompleteTask: handleCompleteTask,
          onCompleteRecurringTask: handleCompleteRecurringTask
        }}
        onSaveTask={editingTask ? handleUpdateTask : handleAddTask}
        onSaveRecurringTask={editingRecurringTask ? handleUpdateRecurringTask : handleAddRecurringTask}
        categories={categories}
        onAddCategory={handleAddCategory}
        categoryColors={categoryColors}
      />
    </>
  );
}
