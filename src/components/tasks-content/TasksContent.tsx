
import React from 'react';
import { Tabs } from "@/components/ui/tabs";
import { TabFilters } from '../TabFilters';
import { CategoryFilters } from '../CategoryFilters';
import { Task } from '@/types/task';
import { RecurringTask, RecurringTaskEntry } from '@/types/recurring-task';
import { DefaultTabContents } from './DefaultTabContents';
import { TaskCategoryTabContent } from './TaskCategoryTabContent';

interface TasksContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  categories: string[];
  filteredTasks: Task[];
  filteredRecurringTasks: RecurringTask[];
  taskEntries: RecurringTaskEntry[];
  categoryColors?: Record<string, string>;
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
  categoryColors = {},
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
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabFilters activeTab={activeTab} />
      
      <CategoryFilters 
        categories={categories} 
        activeTab={activeTab}
        onCategoryClick={onCategoryClick} 
      />
      
      <DefaultTabContents 
        regularTasks={filteredTasks}
        recurringTasks={filteredRecurringTasks}
        taskEntries={taskEntries}
        categoryColors={categoryColors}
        onCompleteTask={onCompleteTask}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onCompleteRecurringTask={onCompleteRecurringTask}
        onEditRecurringTask={onEditRecurringTask}
        onDeleteRecurringTask={onDeleteRecurringTask}
        onViewTaskHistory={onViewTaskHistory}
        onStartFocus={onStartFocus}
      />
      
      {/* Render category tabs */}
      {categories.map(category => (
        <TaskCategoryTabContent
          key={category}
          category={category}
          regularTasks={filteredTasks}
          recurringTasks={filteredRecurringTasks}
          taskEntries={taskEntries}
          categoryColors={categoryColors}
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
