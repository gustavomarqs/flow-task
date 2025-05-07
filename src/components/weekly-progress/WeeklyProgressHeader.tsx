
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface WeeklyProgressHeaderProps {
  completedTasks: number;
  completionRate: number;
}

export function WeeklyProgressHeader({ completedTasks, completionRate }: WeeklyProgressHeaderProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-sm text-gray-400">Tarefas concluídas</span>
        <span className="text-sm font-semibold text-white">{completionRate}%</span>
      </div>
      <div className="relative">
        <Progress 
          value={completionRate} 
          className="h-4 rounded-full bg-zinc-800"
          indicatorClassName="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700 ease-in-out"
        />
        <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white shadow-sm">
          {completionRate}%
        </span>
      </div>
    </div>
  );
}
