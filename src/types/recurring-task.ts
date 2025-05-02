
export interface RecurringTask {
  id: string;
  title: string;
  description?: string;
  category: string;
  active: boolean;
  createdAt: string;
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
