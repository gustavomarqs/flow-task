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
  categoryColors?: Record<string, string>;
}

export function TaskCard({ task, onComplete, onEdit, onDelete, onStartFocus, categoryColors = {} }: TaskCardProps) {
  const categoryColor = categoryColors[task.category];
  
  return (
    <Card className={`mb-6 neon-border hover:animate-pulse-glow transition-all bg-zinc-900/70 rounded-2xl shadow-md ${task.completed ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3 pt-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className={`text-xl ${task.completed ? "line-through text-gray-400" : ""}`}>
              {task.title}
            </CardTitle>
            <CardDescription className="flex items-center mt-2 text-gray-400">
              <Clock className="h-3.5 w-3.5 mr-1.5" /> {formatDate(task.date)}
              {task.time && ` • ${task.time}`}
            </CardDescription>
          </div>
          <CategoryBadge category={task.category} color={categoryColor} />
        </div>
      </CardHeader>
      
      {task.description && (
        <CardContent className="py-3">
          <p className={`text-sm text-gray-300 ${task.completed ? "line-through text-gray-500" : ""}`}>
            {task.description}
          </p>
        </CardContent>
      )}
      
      <CardFooter className="pt-2 pb-4 flex justify-end space-x-2">
        <Button 
          size="sm" 
          variant="ghost" 
          className="text-red-500 hover:text-red-400 hover:bg-red-400/10 transition-colors duration-200"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          className="text-blue-500 hover:text-blue-400 hover:bg-blue-400/10 transition-colors duration-200"
          onClick={() => onEdit(task)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        {onStartFocus && !task.completed && (
          <Button 
            size="sm" 
            variant="outline" 
            className="text-yellow-500 border-yellow-500 hover:bg-yellow-500/10 transition-all duration-200 hover:scale-105"
            onClick={onStartFocus}
          >
            <Timer className="h-4 w-4 mr-1" /> 
            Foco
          </Button>
        )}
        <Button 
          size="sm" 
          variant={task.completed ? "outline" : "secondary"}
          className={task.completed ? 
            "text-green-500 border-green-500 hover:bg-green-500/10 transition-all duration-200 hover:scale-105" : 
            "bg-cyan-700 hover:bg-cyan-600 transition-all duration-200 hover:scale-105"
          }
          onClick={() => onComplete(task.id)}
        >
          <Check className="h-4 w-4 mr-1" /> 
          {task.completed ? "Concluído" : "Concluir"}
        </Button>
      </CardFooter>
    </Card>
  );
}
