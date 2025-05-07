
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { TaskTabContent } from '../task-tab/TaskTabContent';
import { Task } from '@/types/task';
import { RecurringTask, RecurringTaskEntry } from '@/types/recurring-task';

interface TaskCategoryTabContentProps {
  category: string;
  regularTasks: Task[];
  recurringTasks: RecurringTask[];
  taskEntries: RecurringTaskEntry[];
  categoryColors?: Record<string, string>;
  onCompleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onCompleteRecurringTask: (entry: RecurringTaskEntry) => void;
  onEditRecurringTask: (task: RecurringTask) => void;
  onDeleteRecurringTask: (id: string) => void;
  onViewTaskHistory: (taskId: string) => void;
  onStartFocus: (taskType: 'regular' | 'recurring', task: Task | RecurringTask) => void;
}

export function TaskCategoryTabContent({
  category,
  regularTasks,
  recurringTasks,
  taskEntries,
  categoryColors,
  onCompleteTask,
  onEditTask,
  onDeleteTask,
  onCompleteRecurringTask,
  onEditRecurringTask,
  onDeleteRecurringTask,
  onViewTaskHistory,
  onStartFocus
}: TaskCategoryTabContentProps) {
  return (
    <TabsContent value={`category-${category}`} className="mt-0">
      <TaskTabContent
        regularTasks={regularTasks.filter(task => task.category === category)}
        recurringTasks={recurringTasks.filter(task => task.category === category)}
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
  );
}
