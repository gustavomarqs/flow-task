import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Task } from '@/types/task';
import { RecurringTask, RecurringTaskEntry } from '@/types/recurring-task';
import { CategoryBadge } from './CategoryBadge';
import { Clock, Check, Play, Pause } from 'lucide-react';

export interface FocusModeProps {
  selectedTask: { 
    type: 'regular' | 'recurring';
    task: Task | RecurringTask;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleteTask: (id: string) => void;
  onCompleteRecurringTask: (entry: RecurringTaskEntry) => void;
  categoryColors?: Record<string, string>; 
}

export function FocusMode({ 
  selectedTask, 
  isOpen, 
  onClose,
  onCompleteTask,
  onCompleteRecurringTask,
  categoryColors = {} 
}: FocusModeProps) {
  const [progress, setProgress] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(25); // Default to 25 minutes

  useEffect(() => {
    const defaultDuration = (selectedTask?.task && 'timeEstimate' in selectedTask.task && selectedTask.task.timeEstimate)
      ? Math.min(Math.max(selectedTask.task.timeEstimate, 5), 60)
      : 25;

    setSelectedDuration(defaultDuration);
    resetTimer(defaultDuration);
    setProgress(0);
    setTimerActive(false);
  }, [selectedTask]);

  const resetTimer = (minutes: number) => {
    setTimeRemaining(minutes * 60);
    setProgress(0);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    const totalSeconds = selectedDuration * 60;

    if (timerActive && timeRemaining > 0) {
      intervalId = setInterval(() => {
        setTimeRemaining(prevTime => {
          const newTime = prevTime - 1;
          const percentage = ((totalSeconds - newTime) / totalSeconds) * 100;
          setProgress(Math.min(percentage, 100));
          return newTime;
        });
      }, 1000);
    } else if (timeRemaining === 0 && timerActive) {
      setTimerActive(false);
      // Ex: disparar notificação ou som
    }

    return () => clearInterval(intervalId);
  }, [timerActive, timeRemaining, selectedDuration]);

  const toggleTimer = () => {
    setTimerActive(prev => !prev);
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleDurationChange = (value: number[]) => {
    const newDuration = value[0];
    setSelectedDuration(newDuration);
    resetTimer(newDuration);
  };

  const handleComplete = () => {
    if (!selectedTask) return;
    
    if (selectedTask.type === 'regular') {
      onCompleteTask(selectedTask.task.id);
    } else if (selectedTask.type === 'recurring') {
      const today = new Date().toISOString().split('T')[0];
      const recurringTask = selectedTask.task as RecurringTask;
      const newEntry: RecurringTaskEntry = {
        id: `entry-${Date.now()}`,
        recurringTaskId: recurringTask.id,
        title: recurringTask.title,
        date: today,
        completed: true,
        createdAt: new Date().toISOString(),
        category: recurringTask.category
      };
      onCompleteRecurringTask(newEntry);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      if (isOpen) onClose();
    }}>
      <DialogContent className="bg-zinc-900/90 text-white rounded-2xl shadow-md border-zinc-800 border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {selectedTask?.task.title}
          </DialogTitle>
        </DialogHeader>

        <div className="p-5 space-y-6">
          {selectedTask && (
            <div className="mb-4">
              <CategoryBadge category={selectedTask.task.category} color={categoryColors[selectedTask.task.category]} />
              {selectedTask.task.description && (
                <p className="text-sm text-gray-400 mt-3">{selectedTask.task.description}</p>
              )}
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Duração (minutos)</span>
                <span className="text-sm font-medium">{selectedDuration}</span>
              </div>
              <Slider 
                value={[selectedDuration]} 
                min={5} 
                max={60} 
                step={5} 
                onValueChange={handleDurationChange}
                disabled={timerActive}
                className="py-4"
              />
            </div>

            <div className="flex flex-col items-center">
              <div className="text-3xl font-mono font-bold text-center mb-3">
                {formatTime(timeRemaining)}
              </div>
              <Progress value={progress} className="w-full h-2 mb-4" />
            </div>

            <div className="flex items-center justify-between gap-3">
              <Button 
                variant="outline" 
                size="lg"
                className="flex-1 border-cyan-800/40 hover:bg-cyan-900/30 text-white"
                onClick={toggleTimer}
                aria-label={timerActive ? "Pausar timer" : "Iniciar timer"}
              >
                {timerActive ? (
                  <><Pause className="w-4 h-4 mr-2" /> Pausar</>
                ) : (
                  <><Play className="w-4 h-4 mr-2" /> Iniciar</>
                )}
              </Button>

              <Button 
                className="flex-1 bg-cyan-700 hover:bg-cyan-600 text-white" 
                size="lg"
                onClick={handleComplete}
                aria-label="Concluir tarefa"
              >
                <Check className="w-4 h-4 mr-2" />
                Concluir
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
