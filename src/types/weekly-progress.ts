
export interface DayTaskData {
  date: Date;
  total: number;
  completed: number;
}

export interface CategoryData {
  name: string;
  value: number;
}

export interface WeeklyProgressStats {
  weekEntries: any[];
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  tasksByDay: DayTaskData[];
  categoryData: CategoryData[];
  mostProductiveDay?: DayTaskData;
}
