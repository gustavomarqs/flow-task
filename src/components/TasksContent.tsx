
import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import { TabFilters } from '@/components/TabFilters';
import { CategoryFilters } from '@/components/CategoryFilters';
import { TaskTabContent } from '@/components/TaskTabContent';
import { Task } from '@/types/task';
import { RecurringTask, RecurringTaskEntry } from '@/types/recurring-task';

interface TasksContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  categories: string[];
  filteredTasks: Task[];
  filteredRecurringTasks: RecurringTask[];
  taskEntries: RecurringTaskEntry[];
  onCategoryClick: (category: string) => void;
  onCompleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onCompleteRecurringTask: (entry: RecurringTaskEntry) => void;
  onEditRecurringTask: (task: RecurringTask) => void;
  onDeleteRecurringTask: (id: string) => void;
  onViewTaskHistory: (taskId: string) => void;
  onStartFocus: (taskType: 'regular' | 'recurring', task: Task | RecurringTask) => void;
}

export function TasksContent({
  activeTab,
  setActiveTab,
  categories,
  filteredTasks,
  filteredRecurringTasks,
  taskEntries,
  onCategoryClick,
  onCompleteTask,
  onEditTask,
  onDeleteTask,
  onCompleteRecurringTask,
  onEditRecurringTask,
  onDeleteRecurringTask,
  onViewTaskHistory,
  onStartFocus
}: TasksContentProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
      <TabFilters activeTab={activeTab} />
      
      <CategoryFilters 
        categories={categories} 
        activeTab={activeTab} 
        onCategoryClick={onCategoryClick} 
      />

      {/* All tasks tab */}
      <TaskTabContent 
        tabValue="all"
        regularTasks={filteredTasks}
        recurringTasks={filteredRecurringTasks}
        taskEntries={taskEntries}
        onCompleteTask={onCompleteTask}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onCompleteRecurringTask={onCompleteRecurringTask}
        onEditRecurringTask={onEditRecurringTask}
        onDeleteRecurringTask={onDeleteRecurringTask}
        onViewTaskHistory={onViewTaskHistory}
        onStartFocus={onStartFocus}
      />
      
      {/* Pending tasks tab */}
      <TaskTabContent 
        tabValue="pending"
        regularTasks={filteredTasks.filter(task => !task.completed)}
        recurringTasks={filteredRecurringTasks}
        taskEntries={taskEntries}
        onCompleteTask={onCompleteTask}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onCompleteRecurringTask={onCompleteRecurringTask}
        onEditRecurringTask={onEditRecurringTask}
        onDeleteRecurringTask={onDeleteRecurringTask}
        onViewTaskHistory={onViewTaskHistory}
        onStartFocus={onStartFocus}
      />
      
      {/* Completed tasks tab */}
      <TaskTabContent 
        tabValue="completed"
        regularTasks={filteredTasks.filter(task => task.completed)}
        recurringTasks={[]} // Não mostramos tarefas recorrentes na aba de concluídas
        taskEntries={taskEntries}
        onCompleteTask={onCompleteTask}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onCompleteRecurringTask={onCompleteRecurringTask}
        onEditRecurringTask={onEditRecurringTask}
        onDeleteRecurringTask={onDeleteRecurringTask}
        onViewTaskHistory={onViewTaskHistory}
        onStartFocus={onStartFocus}
      />
      
      {/* Category tabs */}
      {categories.map(category => (
        <TaskTabContent 
          key={category}
          tabValue={`category-${category}`}
          regularTasks={filteredTasks.filter(task => task.category === category)}
          recurringTasks={filteredRecurringTasks.filter(task => task.category === category)}
          taskEntries={taskEntries}
          onCompleteTask={onCompleteTask}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onCompleteRecurringTask={onCompleteRecurringTask}
          onEditRecurringTask={onEditRecurringTask}
          onDeleteRecurringTask={onDeleteRecurringTask}
          onViewTaskHistory={onViewTaskHistory}
          onStartFocus={onStartFocus}
        />
      ))}
    </Tabs>
  );
}
