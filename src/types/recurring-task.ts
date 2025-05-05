
export interface RecurringTask {
  id: string;
  title: string;
  description?: string;
  category: string;
  active: boolean;
  createdAt: string;
  frequency?: string; // Adding this property to fix the error
  timeEstimate?: number; // Adding this property to fix the error
  lastCompletedDate?: string; // Adding this property to fix the error
}

export interface RecurringTaskEntry {
  id: string;
  recurringTaskId: string;
  title: string;
  details?: string;
  date: string;
  completed: boolean;
  createdAt: string;
}
