
import React from 'react';

interface WeeklyStatsCardsProps {
  completedTasks: number;
  pendingTasks: number;
}

export function WeeklyStatsCards({ completedTasks, pendingTasks }: WeeklyStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      <div className="rounded-lg bg-zinc-800/80 p-4 sm:p-6 transition-transform duration-200 hover:scale-102 shadow-sm">
        <div className="text-2xl font-bold text-cyan-500">{completedTasks}</div>
        <div className="text-xs text-gray-400 mt-1">Tarefas concluídas esta semana</div>
      </div>
      <div className="rounded-lg bg-zinc-800/80 p-4 sm:p-6 transition-transform duration-200 hover:scale-102 shadow-sm">
        <div className="text-2xl font-bold text-blue-500">{pendingTasks}</div>
        <div className="text-xs text-gray-400 mt-1">Tarefas pendentes esta semana</div>
      </div>
    </div>
  );
}
