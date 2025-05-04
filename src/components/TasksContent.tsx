
import React from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabFilters } from './TabFilters';
import { CategoryFilters } from './CategoryFilters';
import { TaskTabContent } from './TaskTabContent';
import { Task } from '@/types/task';
import { RecurringTask, RecurringTaskEntry } from '@/types/recurring-task';

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
      
      <TabsContent value="all" className="mt-0">
        <TaskTabContent
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
      </TabsContent>
      
      <TabsContent value="pending" className="mt-0">
        <TaskTabContent
          regularTasks={filteredTasks.filter(task => !task.completed)}
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
      </TabsContent>
      
      <TabsContent value="completed" className="mt-0">
        <TaskTabContent
          regularTasks={filteredTasks.filter(task => task.completed)}
          recurringTasks={[]}
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
      </TabsContent>
      
      {/* Dynamic category tabs */}
      {categories.map(category => (
        <TabsContent key={category} value={`category-${category}`} className="mt-0">
          <TaskTabContent
            regularTasks={filteredTasks.filter(task => task.category === category)}
            recurringTasks={filteredRecurringTasks.filter(task => task.category === category)}
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
        </TabsContent>
      ))}
    </Tabs>
  );
}
