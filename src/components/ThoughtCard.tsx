
import React from 'react';
import { 
  Card, 
  CardContent,  
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Clock, Edit, Trash2 } from 'lucide-react';
import { Thought } from '@/types/thought';
import { formatDate } from '@/lib/utils';

interface ThoughtCardProps {
  thought: Thought;
  onEdit: (thought: Thought) => void;
  onDelete: (id: string) => void;
}

export function ThoughtCard({ thought, onEdit, onDelete }: ThoughtCardProps) {
  return (
    <Card className="mb-4 neon-border hover:animate-pulse-glow transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-purple-400">
            <BrainCircuit className="h-5 w-5 mr-2 text-purple-400" /> 
            {thought.title}
          </CardTitle>
          <span className="text-xs text-gray-400 flex items-center">
            <Clock className="h-3 w-3 mr-1" /> {formatDate(thought.date)}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="py-2">
        <p className="text-sm text-gray-300 whitespace-pre-line">{thought.content}</p>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-end space-x-2">
        <Button 
          size="sm" 
          variant="ghost" 
          className="text-red-500 hover:text-red-400 hover:bg-red-400/10"
          onClick={() => onDelete(thought.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          className="text-blue-500 hover:text-blue-400 hover:bg-blue-400/10"
          onClick={() => onEdit(thought)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
