
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RecurringTaskEntry } from '@/types/recurring-task';
import { Progress } from '@/components/ui/progress';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { startOfWeek, endOfWeek, format, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WeeklyProgressCardProps {
  entries: RecurringTaskEntry[];
  categories: string[];
  categoryColors?: Record<string, string>;
}

export function WeeklyProgressCard({ entries, categories, categoryColors = {} }: WeeklyProgressCardProps) {
  // Get current week's date range
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 0 });
  
  // Create an array of dates for the current week
  const weekDates = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Calculate stats using useMemo for better performance
  const {
    weekEntries,
    totalTasks,
    completedTasks,
    completionRate,
    tasksByDay,
    categoryData,
    mostProductiveDay
  } = useMemo(() => {
    // Filter entries for the current week
    const filteredEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= weekStart && entryDate <= weekEnd;
    });
    
    // Calculate completion rate
    const total = filteredEntries.length;
    const completed = filteredEntries.filter(entry => entry.completed).length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Calculate tasks per day
    const byDay = weekDates.map(date => {
      const dayEntries = filteredEntries.filter(entry => 
        isSameDay(new Date(entry.date), date)
      );
      
      return {
        date,
        total: dayEntries.length,
        completed: dayEntries.filter(entry => entry.completed).length
      };
    });
    
    // Calculate most active categories
    const categoryCounts: Record<string, number> = {};
    filteredEntries
      .filter(entry => entry.completed)
      .forEach(entry => {
        const task = entry;
        if (task) {
          const category = task.title.split(':')[0].trim(); // Get category from task name
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        }
      });
    
    const byCategory = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4) // Top 4 categories
      .map(([name, value]) => ({ name, value }));
    
    // Find most productive day
    const mostProductive = [...byDay].sort((a, b) => 
      b.completed - a.completed
    )[0];
    
    return {
      weekEntries: filteredEntries,
      totalTasks: total,
      completedTasks: completed,
      completionRate: rate,
      tasksByDay: byDay,
      categoryData: byCategory,
      mostProductiveDay: mostProductive
    };
  }, [entries, weekStart, weekEnd, weekDates]);
  
  // Color palette for the pie chart - use custom colors if available
  const getColor = (category: string, index: number) => {
    const defaultColors = ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981'];
    return categoryColors[category] || defaultColors[index % defaultColors.length];
  };

  return (
    <Card className="mb-8 overflow-hidden bg-zinc-900/90 shadow-md rounded-2xl">
      <CardHeader className="pb-2 pt-6">
        <CardTitle className="text-xl font-bold text-white/90">Progresso Semanal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-7 p-8">
        {/* Progress bar */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Tarefas concluídas</span>
            <span className="text-sm font-semibold text-white">{completionRate}%</span>
          </div>
          <div className="relative">
            <Progress 
              value={completionRate} 
              className="h-3 rounded-full bg-zinc-800"
              indicatorClassName="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
            />
            <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white shadow-sm">
              {completionRate}%
            </span>
          </div>
        </div>
        
        {/* Task statistics */}
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-lg bg-zinc-800/80 p-6 transition-transform duration-200 hover:scale-102 shadow-sm">
            <div className="text-2xl font-bold text-cyan-500">{completedTasks}</div>
            <div className="text-xs text-gray-400 mt-1">Tarefas concluídas esta semana</div>
          </div>
          <div className="rounded-lg bg-zinc-800/80 p-6 transition-transform duration-200 hover:scale-102 shadow-sm">
            <div className="text-2xl font-bold text-blue-500">{totalTasks - completedTasks}</div>
            <div className="text-xs text-gray-400 mt-1">Tarefas pendentes esta semana</div>
          </div>
        </div>
        
        {/* Day overview */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300">Visão por dia</h4>
          <div className="grid grid-cols-7 gap-2">
            {tasksByDay.map((dayData, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col items-center p-3 rounded-lg shadow-sm transition-transform duration-200 hover:scale-105 ${
                  isToday(dayData.date) ? 'bg-cyan-900/30 ring-2 ring-cyan-500' : 'bg-zinc-800/50'
                }`}
              >
                <span className="text-xs font-medium text-gray-300">{format(dayData.date, 'EEE', { locale: ptBR })}</span>
                <div className="flex flex-col items-center mt-2">
                  <span className="text-lg font-bold text-white">{dayData.completed}</span>
                  <span className="text-xs text-gray-400 rounded-full bg-zinc-700/70 px-2 py-0.5 mt-1">{dayData.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Category breakdown */}
        {categoryData.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-300">Categorias mais ativas</h4>
            <div className="grid grid-cols-2 gap-6">
              {/* Pie chart */}
              <div className="h-32">
                <ChartContainer
                  className="h-32"
                  config={categoryData.reduce((acc, cat, idx) => {
                    acc[cat.name] = { color: getColor(cat.name, idx) };
                    return acc;
                  }, {} as Record<string, { color: string }>)}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={50}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                        label={false}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={getColor(entry.name, index)} 
                          />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              
              {/* Category list */}
              <div className="space-y-3">
                {categoryData.map((cat, idx) => (
                  <div key={cat.name} className="flex justify-between items-center bg-zinc-800/70 rounded-md p-2 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: getColor(cat.name, idx) }} 
                      />
                      <span className="text-sm">{cat.name}</span>
                    </div>
                    <span className="font-medium text-sm rounded-full bg-zinc-700 px-2.5 py-0.5">{cat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Most productive day */}
        {mostProductiveDay && mostProductiveDay.completed > 0 && (
          <div className="rounded-lg bg-cyan-900/20 p-6 border border-cyan-500/30 shadow-md transition-transform duration-200 hover:scale-102">
            <div className="text-xs text-gray-400">Dia mais produtivo</div>
            <div className="text-lg font-bold text-cyan-400 mt-1">
              {format(mostProductiveDay.date, 'EEEE, d/MM', { locale: ptBR })}
            </div>
            <div className="text-sm mt-1">{mostProductiveDay.completed} tarefas concluídas</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
