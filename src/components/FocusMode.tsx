
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Task } from '@/types/task';
import { RecurringTask, RecurringTaskEntry } from '@/types/recurring-task';
import { CategoryBadge } from './CategoryBadge';
import { Clock, Check, X } from 'lucide-react';

export interface FocusModeProps {
  selectedTask: { 
    type: 'regular' | 'recurring';
    task: Task | RecurringTask;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleteTask: (id: string) => void;
  onCompleteRecurringTask: (entry: RecurringTaskEntry) => void;
  categoryColors?: Record<string, string>; // Make categoryColors optional
}

export function FocusMode({ 
  selectedTask, 
  isOpen, 
  onClose,
  onCompleteTask,
  onCompleteRecurringTask,
  categoryColors = {} // Default to empty object
}: FocusModeProps) {
  const [progress, setProgress] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const defaultTime = 600; // Default to 10 minutes
    if (selectedTask?.task) {
      // Safely check if timeEstimate exists
      const estimatedTime = 'timeEstimate' in selectedTask.task ? selectedTask.task.timeEstimate : undefined;
      setTimeRemaining(estimatedTime ? estimatedTime * 60 : defaultTime);
    } else {
      setTimeRemaining(defaultTime);
    }
    setProgress(0);
  }, [selectedTask]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    const defaultTime = 600; // Default to 10 minutes
    
    if (timerActive && timeRemaining > 0) {
      intervalId = setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1);
        
        // Safely calculate progress
        const totalTime = selectedTask?.task && 'timeEstimate' in selectedTask.task ? 
          selectedTask.task.timeEstimate ? selectedTask.task.timeEstimate * 60 : defaultTime : 
          defaultTime;
          
        setProgress(Math.min((1 - (timeRemaining - 1) / totalTime) * 100, 100));
      }, 1000);
    } else if (timeRemaining === 0 && timerActive) {
      setTimerActive(false);
      // Optionally trigger some completion logic here
    }

    return () => clearInterval(intervalId);
  }, [timerActive, timeRemaining, selectedTask]);

  const toggleTimer = () => {
    setTimerActive(prev => !prev);
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleComplete = () => {
    if (selectedTask) {
      if (selectedTask.type === 'regular') {
        onCompleteTask(selectedTask.task.id);
      } else if (selectedTask.type === 'recurring') {
        // Create a new RecurringTaskEntry with the required properties
        const today = new Date().toISOString().split('T')[0];
        const recurringTask = selectedTask.task as RecurringTask;
        const newEntry: RecurringTaskEntry = {
          id: `entry-${Date.now()}`,  // Generate a unique ID
          recurringTaskId: recurringTask.id,
          title: recurringTask.title,
          date: today,
          completed: true,
          createdAt: new Date().toISOString()
        };
        onCompleteRecurringTask(newEntry);
      }
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={() => {
      if (isOpen) onClose();
    }}>
      <DialogContent className="bg-zinc-900/90 text-white rounded-2xl shadow-md border-zinc-800 border">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold flex justify-between items-center">
            {selectedTask?.task.title}
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="p-4">
          {selectedTask && (
            <div className="mb-4">
              <CategoryBadge category={selectedTask.task.category} color={categoryColors[selectedTask.task.category]} />
            </div>
          )}
          <p className="text-sm text-gray-400 mb-4">{selectedTask?.task.description}</p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>Tempo restante: {formatTime(timeRemaining)}</span>
            </div>
            <Button variant="outline" size="sm" onClick={toggleTimer}>
              {timerActive ? 'Pausar' : 'Iniciar'}
            </Button>
          </div>

          <Progress value={progress} className="mb-4" />

          <Button className="w-full bg-cyan-700 hover:bg-cyan-600 text-white" onClick={handleComplete}>
            <Check className="w-4 h-4 mr-2" />
            Concluir tarefa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
