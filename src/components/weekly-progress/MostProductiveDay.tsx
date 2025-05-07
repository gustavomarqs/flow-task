
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DayTaskData } from '@/types/weekly-progress';

interface MostProductiveDayProps {
  mostProductiveDay: DayTaskData | undefined;
}

export function MostProductiveDay({ mostProductiveDay }: MostProductiveDayProps) {
  if (!mostProductiveDay || mostProductiveDay.completed === 0) {
    return null;
  }
  
  return (
    <div className="rounded-lg bg-cyan-900/20 p-4 sm:p-6 border border-cyan-500/30 shadow-md transition-transform duration-200 hover:scale-102">
      <div className="text-xs text-gray-400">Dia mais produtivo</div>
      <div className="text-lg font-bold text-cyan-400 mt-1">
        {format(mostProductiveDay.date, 'EEEE, d/MM', { locale: ptBR })}
      </div>
      <div className="text-sm mt-1">{mostProductiveDay.completed} tarefas concluídas</div>
    </div>
  );
}
