
import React from 'react';
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
import { Clock, Check, Edit, Trash2, Timer } from 'lucide-react';
import { Task } from '@/types/task';
import { formatDate } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStartFocus?: () => void;
}

export function TaskCard({ task, onComplete, onEdit, onDelete, onStartFocus }: TaskCardProps) {
  return (
    <Card className={`mb-4 neon-border hover:animate-pulse-glow transition-all ${task.completed ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className={task.completed ? "line-through text-gray-400" : ""}>
              {task.title}
            </CardTitle>
            <CardDescription className="flex items-center mt-1 text-gray-400">
              <Clock className="h-3 w-3 mr-1" /> {formatDate(task.date)}
              {task.time && ` • ${task.time}`}
            </CardDescription>
          </div>
          <CategoryBadge category={task.category} />
        </div>
      </CardHeader>
      
      {task.description && (
        <CardContent className="py-2">
          <p className={`text-sm text-gray-300 ${task.completed ? "line-through text-gray-500" : ""}`}>
            {task.description}
          </p>
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
        {onStartFocus && !task.completed && (
          <Button 
            size="sm" 
            variant="outline" 
            className="text-yellow-500 border-yellow-500 hover:bg-yellow-500/10"
            onClick={onStartFocus}
          >
            <Timer className="h-4 w-4 mr-1" /> 
            Foco
          </Button>
        )}
        <Button 
          size="sm" 
          variant={task.completed ? "outline" : "secondary"}
          className={task.completed ? "text-green-500 border-green-500" : "bg-green-600 hover:bg-green-500"}
          onClick={() => onComplete(task.id)}
        >
          <Check className="h-4 w-4 mr-1" /> 
          {task.completed ? "Concluído" : "Concluir"}
        </Button>
      </CardFooter>
    </Card>
  );
}
