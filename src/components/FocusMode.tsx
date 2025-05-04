
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { RecurringTask, RecurringTaskEntry } from '@/types/recurring-task';
import { Task } from '@/types/task';
import { Play, Pause, Timer, Clock, CircleStop } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface FocusModeProps {
  selectedTask: {
    type: 'regular' | 'recurring';
    task: Task | RecurringTask;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleteTask: (id: string) => void;
  onCompleteRecurringTask: (entry: RecurringTaskEntry) => void;
}

interface TimerSettings {
  workMinutes: number;
  breakMinutes: number;
}

type TimerPhase = 'work' | 'break' | 'idle';

export function FocusMode({
  selectedTask,
  isOpen,
  onClose,
  onCompleteTask,
  onCompleteRecurringTask
}: FocusModeProps) {
  const { toast } = useToast();
  
  // Timer settings
  const [settings, setSettings] = useState<TimerSettings>({
    workMinutes: 25,
    breakMinutes: 5
  });
  
  // Timer state
  const [remainingSeconds, setRemainingSeconds] = useState(settings.workMinutes * 60);
  const [phase, setPhase] = useState<TimerPhase>('idle');
  const [isRunning, setIsRunning] = useState(false);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [completionDetails, setCompletionDetails] = useState('');
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  
  // Refs
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef(0);
  
  // Reset timer when task changes
  useEffect(() => {
    if (selectedTask) {
      resetTimer();
    }
  }, [selectedTask]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  // Handle timer tick
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
        
        // Update total focus time if in work phase
        if (phase === 'work') {
          setTotalFocusTime(prev => prev + 1);
        }
      }, 1000);
    } else if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, phase]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Start timer
  const startTimer = () => {
    setIsRunning(true);
    
    if (phase === 'idle') {
      setPhase('work');
      setRemainingSeconds(settings.workMinutes * 60);
    }
    
    startTimeRef.current = Date.now();
  };
  
  // Pause timer
  const pauseTimer = () => {
    setIsRunning(false);
    
    if (startTimeRef.current) {
      accumulatedTimeRef.current += (Date.now() - startTimeRef.current) / 1000;
      startTimeRef.current = null;
    }
  };
  
  // Stop timer
  const stopTimer = () => {
    pauseTimer();
    
    // Ask if the user wants to mark the task as completed
    if (totalFocusTime > 60) { // Only show if at least 1 minute of focus time
      setShowCompletionDialog(true);
    } else {
      resetTimer();
    }
  };
  
  // Reset timer
  const resetTimer = () => {
    setIsRunning(false);
    setPhase('idle');
    setRemainingSeconds(settings.workMinutes * 60);
    setTotalFocusTime(0);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = null;
    setCompletionDetails('');
  };
  
  // Handle timer completion
  const handleTimerComplete = () => {
    pauseTimer();
    
    if (phase === 'work') {
      // Work phase completed
      toast({
        title: "Tempo de trabalho concluído!",
        description: "Hora de uma pausa. Relaxe por alguns minutos.",
      });
      
      setPhase('break');
      setRemainingSeconds(settings.breakMinutes * 60);
    } else {
      // Break phase completed
      toast({
        title: "Pausa concluída!",
        description: "Pronto para voltar ao trabalho?",
      });
      
      setPhase('work');
      setRemainingSeconds(settings.workMinutes * 60);
    }
  };
  
  // Mark task as completed
  const completeTask = () => {
    if (!selectedTask) return;
    
    if (selectedTask.type === 'regular') {
      onCompleteTask(selectedTask.task.id);
    } else {
      // Create a new entry for recurring task
      const entry: RecurringTaskEntry = {
        id: uuidv4(),
        recurringTaskId: selectedTask.task.id,
        title: selectedTask.task.title,
        details: completionDetails || `Concluído com ${Math.floor(totalFocusTime / 60)} minutos de foco`,
        date: new Date().toISOString().split('T')[0],
        completed: true,
        createdAt: new Date().toISOString()
      };
      
      onCompleteRecurringTask(entry);
    }
    
    resetTimer();
    setShowCompletionDialog(false);
    onClose();
    
    toast({
      title: "Tarefa concluída!",
      description: "Ótimo trabalho! Continue assim.",
    });
  };
  
  // Skip completion
  const skipCompletion = () => {
    resetTimer();
    setShowCompletionDialog(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && isRunning) {
        pauseTimer();
      }
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[500px] mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Modo Foco</DialogTitle>
          <DialogDescription className="text-center">
            {selectedTask ? `Tarefa: ${selectedTask.task.title}` : 'Nenhuma tarefa selecionada'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-6 space-y-6">
          {/* Timer Display */}
          <Card className="w-full border-2 border-neon bg-deep-dark">
            <CardContent className="flex flex-col items-center py-10">
              <div className="text-6xl font-bold text-neon mb-4">
                {formatTime(remainingSeconds)}
              </div>
              <div className="text-base text-muted-foreground">
                {phase === 'work' ? 'Tempo de trabalho' : phase === 'break' ? 'Tempo de descanso' : 'Pronto para começar?'}
              </div>
              {totalFocusTime > 0 && (
                <div className="mt-4 text-sm text-muted-foreground">
                  Tempo total de foco: {Math.floor(totalFocusTime / 60)} minutos
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Timer Controls */}
          <div className="flex justify-center gap-4 w-full">
            {!isRunning ? (
              <Button 
                onClick={startTimer} 
                variant="default" 
                size="lg" 
                className="w-1/3 py-6"
              >
                <Play className="mr-2" /> Iniciar
              </Button>
            ) : (
              <Button 
                onClick={pauseTimer} 
                variant="secondary" 
                size="lg" 
                className="w-1/3 py-6"
              >
                <Pause className="mr-2" /> Pausar
              </Button>
            )}
            
            <Button 
              onClick={stopTimer} 
              variant="destructive" 
              size="lg" 
              className="w-1/3 py-6"
            >
              <CircleStop className="mr-2" /> Encerrar
            </Button>
          </div>
          
          {/* Timer Settings */}
          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-center">Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Clock size={18} className="mr-2" />
                      <span>Trabalho:</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {[15, 25, 30, 45, 60].map((min) => (
                        <Button
                          key={min}
                          variant={settings.workMinutes === min ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setSettings(prev => ({ ...prev, workMinutes: min }));
                            if (phase === 'idle' || phase === 'work') {
                              setRemainingSeconds(min * 60);
                            }
                          }}
                        >
                          {min}m
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Timer size={18} className="mr-2" />
                      <span>Descanso:</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {[5, 10, 15].map((min) => (
                        <Button
                          key={min}
                          variant={settings.breakMinutes === min ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setSettings(prev => ({ ...prev, breakMinutes: min }));
                            if (phase === 'break') {
                              setRemainingSeconds(min * 60);
                            }
                          }}
                        >
                          {min}m
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <DialogFooter className="justify-center mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (isRunning) {
                pauseTimer();
              }
              onClose();
            }}
            className="w-full"
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
      
      {/* Completion Dialog */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tarefa Concluída?</DialogTitle>
            <DialogDescription>
              Você dedicou {Math.floor(totalFocusTime / 60)} minutos de foco nesta tarefa. Deseja marcá-la como concluída?
            </DialogDescription>
          </DialogHeader>
          
          {selectedTask?.type === 'recurring' && (
            <Textarea
              placeholder="Adicione detalhes sobre o que você realizou..."
              value={completionDetails}
              onChange={(e) => setCompletionDetails(e.target.value)}
              className="mt-2"
            />
          )}
          
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={skipCompletion}>Não</Button>
            <Button onClick={completeTask} className="bg-green-600 hover:bg-green-500">
              Sim, Concluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
