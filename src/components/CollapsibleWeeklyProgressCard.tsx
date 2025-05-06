
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeeklyProgressCard } from '@/components/WeeklyProgressCard';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button'; 
import { RecurringTaskEntry } from '@/types/recurring-task';
import { Task } from '@/types/task';

interface CollapsibleWeeklyProgressCardProps {
  entries: RecurringTaskEntry[];
  tasks: Task[];
  categories: string[];
  categoryColors?: Record<string, string>;
}

export function CollapsibleWeeklyProgressCard({
  entries,
  tasks,
  categories,
  categoryColors = {}
}: CollapsibleWeeklyProgressCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  return (
    <Card className="mb-8 overflow-hidden bg-zinc-900/90 shadow-md rounded-2xl">
      <CardHeader className="pb-2 pt-6 flex flex-row justify-between items-center">
        <CardTitle className="text-xl font-bold text-white/90">Progresso Semanal</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleExpanded}
          className="text-gray-400 hover:text-white hover:bg-zinc-800"
          aria-label={isExpanded ? "Minimizar progresso semanal" : "Expandir progresso semanal"}
        >
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="p-0">
          <WeeklyProgressCard 
            entries={entries}
            tasks={tasks}
            categories={categories}
            categoryColors={categoryColors}
          />
        </CardContent>
      )}
    </Card>
  );
}
