
export interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  date: string;
  time?: string;
  completed: boolean;
  createdAt: string;
}
