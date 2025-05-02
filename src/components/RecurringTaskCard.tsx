
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from '@/components/CategoryBadge';
import { Textarea } from "@/components/ui/textarea";
import { Check, Edit, Trash2, ChartBar } from 'lucide-react';
import { RecurringTask, RecurringTaskEntry } from '@/types/recurring-task';
import { v4 as uuidv4 } from 'uuid';

interface RecurringTaskCardProps {
  task: RecurringTask;
  todaysEntry?: RecurringTaskEntry | null;
  onComplete: (entry: RecurringTaskEntry) => void;
  onEdit: (task: RecurringTask) => void;
  onDelete: (id: string) => void;
  onViewHistory: (taskId: string) => void;
}

export function RecurringTaskCard({ 
  task, 
  todaysEntry = null,
  onComplete, 
  onEdit, 
  onDelete,
  onViewHistory
}: RecurringTaskCardProps) {
  const [details, setDetails] = useState(todaysEntry?.details || "");
  const [showDetailsInput, setShowDetailsInput] = useState(false);
  
  const handleComplete = () => {
    // If there's already an entry for today, update it, otherwise create a new one
    const entry: RecurringTaskEntry = todaysEntry 
      ? { ...todaysEntry, details, completed: !todaysEntry.completed }
      : {
          id: uuidv4(),
          recurringTaskId: task.id,
          title: task.title,
          details,
          date: new Date().toISOString().split('T')[0],
          completed: true,
          createdAt: new Date().toISOString()
        };
        
    onComplete(entry);
    if (!todaysEntry?.completed) {
      setShowDetailsInput(true);
    } else {
      setShowDetailsInput(false);
    }
  };

  const saveDetails = () => {
    if (!todaysEntry) return;
    
    const updatedEntry = {
      ...todaysEntry,
      details
    };
    
    onComplete(updatedEntry);
    setShowDetailsInput(false);
  };

  return (
    <Card className="mb-4 neon-border hover:animate-pulse-glow transition-all">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className={todaysEntry?.completed ? "line-through text-gray-400" : ""}>
              {task.title}
            </CardTitle>
            <CardDescription className="flex items-center mt-1 text-gray-400">
              Tarefa recorrente diária
            </CardDescription>
          </div>
          <CategoryBadge category={task.category} />
        </div>
      </CardHeader>
      
      {task.description && (
        <CardContent className="py-2">
          <p className="text-sm text-gray-300">
            {task.description}
          </p>
        </CardContent>
      )}
      
      {showDetailsInput && (
        <CardContent className="pt-0 pb-3">
          <div className="space-y-2">
            <Textarea
              placeholder="Adicione detalhes sobre o que você fez hoje..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="bg-medium-gray"
            />
            <div className="flex justify-end">
              <Button size="sm" onClick={saveDetails}>
                Salvar Detalhes
              </Button>
            </div>
          </div>
        </CardContent>
      )}
      
      {todaysEntry?.details && !showDetailsInput && (
        <CardContent className="py-2">
          <div className="bg-dark-gray p-2 rounded-md">
            <p className="text-sm italic text-gray-300">"{todaysEntry.details}"</p>
          </div>
        </CardContent>
      )}
      
      <CardFooter className="pt-2 flex justify-end space-x-2">
        <Button 
          size="sm" 
          variant="ghost" 
          className="text-red-500 hover:text-red-400 hover:bg-red-400/10"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          className="text-blue-500 hover:text-blue-400 hover:bg-blue-400/10"
          onClick={() => onEdit(task)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          size="sm"
          variant="outline"
          onClick={() => onViewHistory(task.id)}
          className="text-yellow-500 hover:text-yellow-400"
        >
          <ChartBar className="h-4 w-4 mr-1" /> 
          Histórico
        </Button>
        <Button 
          size="sm" 
          variant={todaysEntry?.completed ? "outline" : "secondary"}
          className={todaysEntry?.completed ? "text-green-500 border-green-500" : "bg-green-600 hover:bg-green-500"}
          onClick={handleComplete}
        >
          <Check className="h-4 w-4 mr-1" /> 
          {todaysEntry?.completed ? "Concluído" : "Concluir"}
        </Button>
      </CardFooter>
    </Card>
  );
}
