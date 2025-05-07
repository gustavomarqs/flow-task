
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { CategoryData } from '@/types/weekly-progress';

interface CategoryBreakdownProps {
  categoryData: CategoryData[];
  completedTasks: number;
  getColor: (category: string, index: number) => string;
}

export function CategoryBreakdown({ categoryData, completedTasks, getColor }: CategoryBreakdownProps) {
  if (categoryData.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-300">Categorias mais ativas</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Pie chart */}
        <div className="h-48 sm:h-40">
          <ChartContainer
            className="h-full"
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
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                  animationBegin={0}
                  animationDuration={800}
                  label={(props) => {
                    const { cx, cy, midAngle, innerRadius, outerRadius, name, value } = props;
                    const RADIAN = Math.PI / 180;
                    const radius = 25 + innerRadius + (outerRadius - innerRadius);
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    // Only show label for larger segments to prevent overlap
                    return value > completedTasks * 0.1 ? (
                      <text 
                        x={x} 
                        y={y} 
                        fill={getColor(name as string, props.index)}
                        textAnchor={x > cx ? 'start' : 'end'} 
                        dominantBaseline="central"
                        className="text-[10px] font-medium"
                      >
                        {name}
                      </text>
                    ) : null;
                  }}
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getColor(entry.name, index)} 
                      stroke="rgba(20, 20, 20, 0.2)"
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        {/* Category list */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {categoryData.map((cat, idx) => (
            <div key={cat.name} className="flex justify-between items-center bg-zinc-800/70 rounded-md p-2 shadow-sm hover:bg-zinc-700/50 transition-colors">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: getColor(cat.name, idx) }} 
                />
                <span className="text-sm font-medium">{cat.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400">{Math.round((cat.value / completedTasks) * 100)}%</span>
                <span className="font-medium text-sm rounded-full bg-zinc-700 px-2.5 py-0.5">{cat.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
