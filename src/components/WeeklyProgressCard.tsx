
import React, { useMemo } from 'react';
import { CardContent } from '@/components/ui/card';
import { RecurringTaskEntry } from '@/types/recurring-task';
import { Task } from '@/types/task';
import { calculateWeeklyProgressStats, getCategoryColor } from '@/utils/weekly-progress';
import { WeeklyProgressHeader } from '@/components/weekly-progress/WeeklyProgressHeader';
import { WeeklyStatsCards } from '@/components/weekly-progress/WeeklyStatsCards';
import { WeeklyDayOverview } from '@/components/weekly-progress/WeeklyDayOverview';
import { CategoryBreakdown } from '@/components/weekly-progress/CategoryBreakdown';
import { MostProductiveDay } from '@/components/weekly-progress/MostProductiveDay';

interface WeeklyProgressCardProps {
  entries: RecurringTaskEntry[];
  tasks: Task[];
  categories: string[];
  categoryColors?: Record<string, string>;
}

export function WeeklyProgressCard({ 
  entries, 
  tasks, 
  categories, 
  categoryColors = {} 
}: WeeklyProgressCardProps) {
  // Calculate stats using useMemo for better performance
  const stats = useMemo(() => {
    return calculateWeeklyProgressStats(entries, tasks);
  }, [entries, tasks]);
  
  // Function to get color for a category
  const getColor = (category: string, index: number) => {
    // First look up the color in the categoryColors passed from props
    if (categoryColors && categoryColors[category]) {
      return categoryColors[category];
    }
    
    // As fallback, use getCategoryColor
    return getCategoryColor(category, index, categoryColors);
  };

  return (
    <CardContent className="space-y-7 p-6 sm:p-8">
      {/* Progress bar */}
      <WeeklyProgressHeader 
        completedTasks={stats.completedTasks}
        completionRate={stats.completionRate}
      />
      
      {/* Task statistics */}
      <WeeklyStatsCards
        completedTasks={stats.completedTasks}
        pendingTasks={stats.totalTasks - stats.completedTasks}
      />
      
      {/* Day overview - with horizontal scroll for mobile */}
      <WeeklyDayOverview tasksByDay={stats.tasksByDay} />
      
      {/* Category breakdown */}
      <CategoryBreakdown
        categoryData={stats.categoryData}
        completedTasks={stats.completedTasks}
        getColor={getColor}
      />
      
      {/* Most productive day */}
      <MostProductiveDay mostProductiveDay={stats.mostProductiveDay} />
    </CardContent>
  );
}
