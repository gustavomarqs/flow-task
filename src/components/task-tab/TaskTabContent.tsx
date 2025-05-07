
import React from 'react';
import { Task } from '@/types/task';
import { RecurringTask, RecurringTaskEntry } from '@/types/recurring-task';
import { TaskList } from './TaskList';

interface TaskTabContentProps {
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

export function TaskTabContent({
  regularTasks,
  recurringTasks,
  taskEntries,
  categoryColors = {},
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
    <div className="space-y-4">
      <TaskList
        regularTasks={regularTasks}
        recurringTasks={recurringTasks}
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
    </div>
  );
}
