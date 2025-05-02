
import React from 'react';
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
}

export function WeeklyProgressCard({ entries, categories }: WeeklyProgressCardProps) {
  // Get current week's date range
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 0 });
  
  // Create an array of dates for the current week
  const weekDates = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Filter entries for the current week
  const weekEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= weekStart && entryDate <= weekEnd;
  });
  
  // Calculate completion rate
  const totalTasks = weekEntries.length;
  const completedTasks = weekEntries.filter(entry => entry.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Calculate tasks per day
  const tasksByDay = weekDates.map(date => {
    const dayEntries = weekEntries.filter(entry => 
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
  weekEntries
    .filter(entry => entry.completed)
    .forEach(entry => {
      const task = entry;
      if (task) {
        const category = task.title.split(':')[0].trim(); // Get category from task name
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      }
    });
  
  const categoryData = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4) // Top 4 categories
    .map(([name, value]) => ({ name, value }));
  
  // Find most productive day
  const mostProductiveDay = [...tasksByDay].sort((a, b) => 
    b.completed - a.completed
  )[0];
  
  // Color palette for the pie chart
  const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#0088FE'];

  return (
    <Card className="mb-6 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl">Progresso Semanal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Tarefas concluídas</span>
            <span className="text-sm font-medium">{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>
        
        {/* Task statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-md bg-medium-gray p-4">
            <div className="text-2xl font-bold">{completedTasks}</div>
            <div className="text-xs text-muted-foreground">Tarefas concluídas esta semana</div>
          </div>
          <div className="rounded-md bg-medium-gray p-4">
            <div className="text-2xl font-bold">{totalTasks - completedTasks}</div>
            <div className="text-xs text-muted-foreground">Tarefas pendentes esta semana</div>
          </div>
        </div>
        
        {/* Day overview */}
        <div className="space-y-1">
          <h4 className="text-sm font-medium">Visão por dia</h4>
          <div className="grid grid-cols-7 gap-1">
            {tasksByDay.map((dayData, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col items-center p-2 rounded-md ${
                  isToday(dayData.date) ? 'bg-neon/20' : 'bg-medium-gray/40'
                }`}
              >
                <span className="text-xs">{format(dayData.date, 'EEE', { locale: ptBR })}</span>
                <span className="text-lg font-bold">{dayData.completed}</span>
                <span className="text-xs text-muted-foreground">/{dayData.total}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Category breakdown */}
        {categoryData.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Categorias mais ativas</h4>
            <div className="grid grid-cols-2 gap-4">
              {/* Pie chart */}
              <div className="h-32">
                <ChartContainer
                  className="h-32"
                  config={{
                    'Treinos': { color: COLORS[0] },
                    'Estudos': { color: COLORS[1] },
                    'Trabalho': { color: COLORS[2] },
                    'Projetos': { color: COLORS[3] }
                  }}
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
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              
              {/* Category list */}
              <div className="space-y-2">
                {categoryData.map((cat, idx) => (
                  <div key={cat.name} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="text-sm">{cat.name}</span>
                    </div>
                    <span className="font-medium text-sm">{cat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Most productive day */}
        {mostProductiveDay && mostProductiveDay.completed > 0 && (
          <div className="rounded-md bg-neon/10 p-4 border border-neon/20">
            <div className="text-xs text-muted-foreground">Dia mais produtivo</div>
            <div className="text-lg font-bold">
              {format(mostProductiveDay.date, 'EEEE, d/MM', { locale: ptBR })}
            </div>
            <div className="text-sm">{mostProductiveDay.completed} tarefas concluídas</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
