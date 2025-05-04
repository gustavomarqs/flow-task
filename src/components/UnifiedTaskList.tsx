
import React from 'react';
import { Task } from '@/types/task';
import { RecurringTask, RecurringTaskEntry } from '@/types/recurring-task';
import { TaskCard } from './TaskCard';
import { RecurringTaskCard } from './RecurringTaskCard';

interface UnifiedTaskListProps {
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
  onStartFocus?: (taskType: 'regular' | 'recurring', task: Task | RecurringTask) => void;
}

export function UnifiedTaskList({
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
}: UnifiedTaskListProps) {
  // Obtém as entradas de hoje para tarefas recorrentes
  const today = new Date().toISOString().split('T')[0];
  const todaysEntries = taskEntries.filter(entry => entry.date === today);
  
  // Helper para obter entrada de hoje para uma tarefa recorrente
  const getTodaysEntryForTask = (taskId: string) => {
    return todaysEntries.find(entry => entry.recurringTaskId === taskId) || null;
  };

  const allTasks: { type: 'regular' | 'recurring'; id: string; date: string; time?: string }[] = [
    // Regular tasks
    ...regularTasks.map(task => ({
      type: 'regular' as const,
      id: task.id,
      date: task.date,
      time: task.time
    })),
    
    // Recurring tasks
    ...recurringTasks
      .filter(task => task.active)
      .map(task => ({
        type: 'recurring' as const,
        id: task.id,
        date: today,
        time: undefined
      }))
  ];

  // Ordenamos todas as tarefas por data e hora
  const sortedTasks = allTasks.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
    const dateB = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
    return dateA - dateB;
  });

  if (sortedTasks.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-gray-700 rounded-lg">
        <p className="text-gray-400">
          Nenhuma tarefa encontrada. Comece adicionando uma nova tarefa!
        </p>
      </div>
    );
  }

  return (
    <div>
      {sortedTasks.map((item) => {
        if (item.type === 'regular') {
          // Encontrar a tarefa regular
          const task = regularTasks.find(t => t.id === item.id);
          if (!task) return null;
          
          return (
            <TaskCard
              key={`regular-${task.id}`}
              task={task}
              categoryColors={categoryColors}
              onComplete={onCompleteTask}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onStartFocus={onStartFocus ? () => onStartFocus('regular', task) : undefined}
            />
          );
        } else {
          // Encontrar a tarefa recorrente
          const task = recurringTasks.find(t => t.id === item.id);
          if (!task) return null;
          
          return (
            <RecurringTaskCard
              key={`recurring-${task.id}`}
              task={task}
              todaysEntry={getTodaysEntryForTask(task.id)}
              categoryColor={categoryColors[task.category]}
              onComplete={onCompleteRecurringTask}
              onEdit={onEditRecurringTask}
              onDelete={onDeleteRecurringTask}
              onViewHistory={onViewTaskHistory}
              onStartFocus={onStartFocus ? () => onStartFocus('recurring', task) : undefined}
            />
          );
        }
      })}
    </div>
  );
}
