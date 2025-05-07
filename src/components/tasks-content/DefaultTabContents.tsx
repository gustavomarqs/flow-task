
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { TaskTabContent } from '../task-tab/TaskTabContent';
import { Task } from '@/types/task';
import { RecurringTask, RecurringTaskEntry } from '@/types/recurring-task';

interface DefaultTabContentsProps {
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

export function DefaultTabContents({
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
}: DefaultTabContentsProps) {
  return (
    <>
      <TabsContent value="all" className="mt-0">
        <TaskTabContent
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
      </TabsContent>
      
      <TabsContent value="pending" className="mt-0">
        <TaskTabContent
          regularTasks={regularTasks.filter(task => !task.completed)}
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
      </TabsContent>
      
      <TabsContent value="completed" className="mt-0">
        <TaskTabContent
          regularTasks={regularTasks.filter(task => task.completed)}
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
    </>
  );
}
