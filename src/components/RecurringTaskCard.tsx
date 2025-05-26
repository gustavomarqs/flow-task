import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RecurringTask, RecurringTaskEntry } from '@/types/recurring-task';
import { CategoryBadge } from './CategoryBadge';
import { formatDateTime } from '@/utils/format';
import { Clock, CheckCircle, Calendar, MoreVertical, Edit, Trash, History, PlayCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export interface RecurringTaskCardProps {
  task: RecurringTask;
  todaysEntry: RecurringTaskEntry | null;
  categoryColor?: string;
  onComplete: (entry: RecurringTaskEntry) => void;
  onEdit: (task: RecurringTask) => void;
  onDelete: (id: string) => void;
  onViewHistory: (taskId: string) => void;
  onStartFocus: () => void;
}

export function RecurringTaskCard({
  task,
  todaysEntry,
  categoryColor,
  onComplete,
  onEdit,
  onDelete,
  onViewHistory,
  onStartFocus
}: RecurringTaskCardProps) {
  const [isCompletionDialogOpen, setIsCompletionDialogOpen] = useState(false);
  const [entryDetails, setEntryDetails] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleCompleteClick = () => {
    if (todaysEntry?.completed) {
      onComplete({ ...todaysEntry, completed: false });
    } else {
      setIsCompletionDialogOpen(true);
    }
  };

  const handleConfirmCompletion = () => {
    const completedEntry: RecurringTaskEntry = todaysEntry
      ? { ...todaysEntry, completed: true, details: entryDetails }
      : {
          id: `entry-${Date.now()}`,
          recurringTaskId: task.id,
          title: task.title,
          details: entryDetails,
          date: today,
          completed: true,
          createdAt: new Date().toISOString(),
          category: task.category
        };

    onComplete(completedEntry);
    setEntryDetails('');
    setIsCompletionDialogOpen(false);
  };

  const isCompleted = !!todaysEntry?.completed;

  return (
    <>
      <Card
        className={`w-full bg-zinc-900/90 border-zinc-800 rounded-2xl shadow-md transition-transform hover:shadow-lg hover:translate-y-[-2px] animate-fade-in ${isCompleted ? 'opacity-70' : ''}`}
      >
        <CardHeader className="pb-2 pt-6">
          <CardTitle className={`text-lg font-semibold flex justify-between items-center ${isCompleted ? 'line-through text-gray-400' : ''}`}>
            {task.title}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Mais ações">
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewHistory(task.id)}>
                  <History className="mr-2 h-4 w-4" /> Ver histórico
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(task.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash className="mr-2 h-4 w-4" /> Excluir
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
            <p className={`text-sm text-gray-400 mb-3 ${isCompleted ? 'line-through' : ''}`}>
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-x-4 text-sm text-gray-400 mb-1">
            {task.frequency && (
              <div className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
                <span>{task.frequency}</span>
              </div>
            )}
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

          {isCompleted && todaysEntry?.details && (
            <div className="mt-2 p-2 bg-zinc-800/50 rounded-md">
              <p className="text-xs text-gray-300 italic">{todaysEntry.details}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between pt-4 pb-4">
          <Button
            size="sm"
            variant="outline"
            className="text-xs border-cyan-800/40 hover:bg-cyan-900/30"
            onClick={onStartFocus}
            aria-label="Iniciar modo foco"
          >
            <PlayCircle className="mr-1 h-3.5 w-3.5" />
            Iniciar foco
          </Button>

          <Button
            onClick={handleCompleteClick}
            size="sm"
            variant={isCompleted ? "outline" : "default"}
            className={isCompleted
              ? "text-xs text-green-500 border-green-500/30 hover:bg-green-900/20"
              : "text-xs bg-cyan-700 hover:bg-cyan-600"}
            aria-label={isCompleted ? "Marcar como não concluída" : "Concluir tarefa"}
          >
            <CheckCircle className="mr-1 h-3.5 w-3.5" />
            {isCompleted ? 'Concluída' : 'Concluir'}
          </Button>
        </CardFooter>
      </Card>

      {/* Modal de conclusão */}
      <Dialog open={isCompletionDialogOpen} onOpenChange={setIsCompletionDialogOpen}>
        <DialogContent className="bg-zinc-900 border border-zinc-700">
          <DialogHeader>
            <DialogTitle>Concluir: {task.title}</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <Textarea
              placeholder="Adicione detalhes sobre esta conclusão (opcional)"
              className="min-h-[100px] bg-zinc-800"
              value={entryDetails}
              onChange={e => setEntryDetails(e.target.value)}
            />
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsCompletionDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmCompletion} className="bg-cyan-700 hover:bg-cyan-600">
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirmar conclusão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
