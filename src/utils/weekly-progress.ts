
import { startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { RecurringTaskEntry } from '@/types/recurring-task';
import { Task } from '@/types/task';
import { WeeklyProgressStats, DayTaskData } from '@/types/weekly-progress';

/**
 * Calculate weekly progress statistics
 */
export function calculateWeeklyProgressStats(
  entries: RecurringTaskEntry[], 
  tasks: Task[]
): WeeklyProgressStats {
  // Get current week's date range
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 0 });
  
  // Create an array of dates for the current week
  const weekDates = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Filter entries for the current week
  const filteredEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= weekStart && entryDate <= weekEnd;
  });
  
  // Filter tasks for the current week
  const filteredTasks = tasks.filter(task => {
    const taskDate = new Date(task.date);
    return taskDate >= weekStart && taskDate <= weekEnd;
  });
  
  // Combine recurring task entries and regular tasks for total count
  const totalRecurringEntries = filteredEntries.length;
  const totalRegularTasks = filteredTasks.length;
  const total = totalRecurringEntries + totalRegularTasks;
  
  // Count completed tasks
  const completedRecurringEntries = filteredEntries.filter(entry => entry.completed).length;
  const completedRegularTasks = filteredTasks.filter(task => task.completed).length;
  const completed = completedRecurringEntries + completedRegularTasks;
  
  // Calculate completion rate
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  // Calculate tasks per day
  const byDay = weekDates.map(date => {
    // Recurring task entries for this day
    const dayEntries = filteredEntries.filter(entry => 
      isSameDay(new Date(entry.date), date)
    );
    
    // Regular tasks for this day
    const dayTasks = filteredTasks.filter(task =>
      isSameDay(new Date(task.date), date)
    );
    
    return {
      date,
      total: dayEntries.length + dayTasks.length,
      completed: dayEntries.filter(entry => entry.completed).length + 
              dayTasks.filter(task => task.completed).length
    };
  });
  
  // Get categories from completed tasks and entries
  const categoryTaskCount: Record<string, number> = {};
  
  // Count completed recurring task entries by category
  filteredEntries
    .filter(entry => entry.completed)
    .forEach(entry => {
      const taskCategory = entry.category || "Sem categoria";
      categoryTaskCount[taskCategory] = (categoryTaskCount[taskCategory] || 0) + 1;
    });
  
  // Count regular tasks by category
  filteredTasks
    .filter(task => task.completed)
    .forEach(task => {
      const taskCategory = task.category || "Sem categoria";
      categoryTaskCount[taskCategory] = (categoryTaskCount[taskCategory] || 0) + 1;
    });
  
  // Convert to array format for the pie chart
  const byCategory = Object.entries(categoryTaskCount)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));
  
  // Find most productive day
  const mostProductive = [...byDay]
    .sort((a, b) => b.completed - a.completed)[0];
  
  // Return combined statistics
  return {
    weekEntries: filteredEntries,
    totalTasks: total,
    completedTasks: completed,
    completionRate: rate,
    tasksByDay: byDay,
    categoryData: byCategory,
    mostProductiveDay: mostProductive.completed > 0 ? mostProductive : undefined
  };
}

/**
 * Get a color for a category from a palette or custom colors
 */
export function getCategoryColor(
  category: string, 
  index: number, 
  categoryColors: Record<string, string>
): string {
  // Default color palette
  const defaultColors = [
    '#06b6d4', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'
  ];
  
  // Return custom color if available, or default color
  return categoryColors[category] || defaultColors[index % defaultColors.length];
}
