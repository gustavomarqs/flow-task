
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { UnifiedTaskList } from '@/components/UnifiedTaskList';
import { Task } from '@/types/task';
import { RecurringTask, RecurringTaskEntry } from '@/types/recurring-task';

interface TaskTabContentProps {
  tabValue: string;
  regularTasks: Task[];
  recurringTasks: RecurringTask[];
  taskEntries: RecurringTaskEntry[];
  onCompleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onCompleteRecurringTask: (entry: RecurringTaskEntry) => void;
  onEditRecurringTask: (task: RecurringTask) => void;
  onDeleteRecurringTask: (id: string) => void;
  onViewTaskHistory: (taskId: string) => void;
  onStartFocus: (taskType: 'regular' | 'recurring', task: Task | RecurringTask) => void;
}

export function TaskTabContent({
  tabValue,
  regularTasks,
  recurringTasks,
  taskEntries,
  onCompleteTask,
  onEditTask,
  onDeleteTask,
  onCompleteRecurringTask,
  onEditRecurringTask,
  onDeleteRecurringTask,
  onViewTaskHistory,
  onStartFocus
}: TaskTabContentProps) {
  return (
    <TabsContent value={tabValue} className="mt-4">
      <UnifiedTaskList
        regularTasks={regularTasks}
        recurringTasks={recurringTasks}
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
    </TabsContent>
  );
}
