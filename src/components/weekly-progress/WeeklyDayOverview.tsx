
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, isToday, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DayTaskData } from '@/types/weekly-progress';

interface WeeklyDayOverviewProps {
  tasksByDay: DayTaskData[];
}

export function WeeklyDayOverview({ tasksByDay }: WeeklyDayOverviewProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-300">Visão por dia</h4>
      <ScrollArea className="w-full">
        <div className="flex space-x-2 min-w-max pb-2">
          {tasksByDay.map((dayData, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col items-center p-3 rounded-lg shadow-sm transition-transform duration-200 hover:scale-105 min-w-[80px] ${
                isToday(dayData.date) ? 'bg-cyan-900/30 ring-2 ring-cyan-500' : 'bg-zinc-800/50'
              }`}
            >
              <span className="text-xs font-medium text-gray-300">{format(dayData.date, 'EEE', { locale: ptBR })}</span>
              <div className="flex flex-col items-center mt-2">
                <span className="text-lg font-bold text-white">{dayData.completed}</span>
                <span className="text-xs text-gray-400 rounded-full bg-zinc-700/70 px-2 py-0.5 mt-1">{dayData.total}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
