import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RecurringTask, RecurringTaskEntry } from '@/types/recurring-task';
import { CategoryBadge } from './CategoryBadge';
import { formatDateTime } from '@/utils/format';
import { Clock, CheckCircle, Calendar, MoreVertical, Edit, Trash, History, PlayCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export interface RecurringTaskCardProps {
  task: RecurringTask;
  todaysEntry: RecurringTaskEntry;
  categoryColor?: string; // Make categoryColor optional
  onComplete: (entry: RecurringTaskEntry) => void;
  onEdit: (task: RecurringTask) => void;
  onDelete: (id: string) => void;
  onViewHistory: (taskId: string) => void;
  onStartFocus: () => void;
}

export function RecurringTaskCard({
  task,
  todaysEntry,
  categoryColor,  // Now correctly includes categoryColor
  onComplete,
  onEdit,
  onDelete,
  onViewHistory,
  onStartFocus
}: RecurringTaskCardProps) {
  const handleComplete = () => {
    if (todaysEntry) {
      onComplete(todaysEntry);
    }
  };

  return (
    <Card className={`w-full bg-zinc-900/90 border-zinc-800 rounded-2xl shadow-md transition-transform hover:shadow-lg hover:translate-y-[-2px] animate-fade-in ${todaysEntry?.completed ? 'opacity-70' : ''}`}>
      <CardHeader className="pb-2 pt-6">
        <CardTitle className={`text-lg font-semibold flex justify-between items-center ${todaysEntry?.completed ? 'line-through text-gray-400' : ''}`}>
          {task.title}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <MoreVertical size={16} />
                <span className="sr-only">Mais ações</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Editar</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewHistory(task.id)}>
                <History className="mr-2 h-4 w-4" />
                <span>Ver histórico</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-red-500 hover:text-red-600">
                <Trash className="mr-2 h-4 w-4" />
                <span>Excluir</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>

        <div className="flex gap-2 mt-1.5">
          <CategoryBadge category={task.category} color={categoryColor} />
        </div>
      </CardHeader>

      <CardContent className="py-0">
        {task.description && (
          <p className={`text-sm text-gray-400 mb-3 ${todaysEntry?.completed ? 'line-through' : ''}`}>{task.description}</p>
        )}
        <div className="flex items-center gap-x-4 text-sm text-gray-400 mb-1">
          <div className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
            <span>{task.frequency}</span>
          </div>
          {task.timeEstimate && (
            <div className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
              <span>{task.timeEstimate} min</span>
            </div>
          )}
        </div>
        <div className="text-xs text-gray-500">
          Último registro: {task.lastCompletedDate ? formatDateTime(new Date(task.lastCompletedDate)) : 'Nunca completada'}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-4 pb-4">
        <Button
          size="sm"
          variant="outline"
          className="text-xs border-cyan-800/40 hover:bg-cyan-900/30"
          onClick={onStartFocus}
        >
          <PlayCircle className="mr-1 h-3.5 w-3.5" />
          Iniciar foco
        </Button>

        <Button 
          onClick={() => handleComplete()} 
          size="sm"
          variant={todaysEntry?.completed ? "outline" : "default"}
          className={todaysEntry?.completed 
            ? "text-xs text-green-500 border-green-500/30 hover:bg-green-900/20" 
            : "text-xs bg-cyan-700 hover:bg-cyan-600"}
        >
          <CheckCircle className="mr-1 h-3.5 w-3.5" />
          {todaysEntry?.completed ? 'Concluída' : 'Concluir'}
        </Button>
      </CardFooter>
    </Card>
  );
}
