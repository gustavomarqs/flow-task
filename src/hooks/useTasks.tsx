
import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { getFromStorage, saveToStorage } from '@/utils/storage';
import { getCurrentDateTime } from '@/utils/date-time';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/auth/AuthProvider';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Load tasks from localStorage
  useEffect(() => {
    if (user) {
      const savedTasks = getFromStorage(`tasks_${user.id}`, []);
      if (savedTasks.length > 0) {
        setTasks(savedTasks);
      }
    }
  }, [user?.id]);
  
  // Save tasks to localStorage
  useEffect(() => {
    if (user) {
      saveToStorage(`tasks_${user.id}`, tasks);
    }
  }, [tasks, user?.id]);
  
  // Task handlers
  const handleAddTask = (task: Task) => {
    const taskWithTimestamp = {
      ...task,
      createdAt: task.createdAt || getCurrentDateTime()
    };
    
    setTasks(prevTasks => [...prevTasks, taskWithTimestamp]);
    toast({
      title: "Tarefa adicionada",
      description: "Nova tarefa adicionada com sucesso!",
    });
  };
  
  const handleUpdateTask = (task: Task) => {
    setTasks(prevTasks => prevTasks.map(t => t.id === task.id ? task : t));
    toast({
      title: "Tarefa atualizada",
      description: "Tarefa editada com sucesso!",
    });
  };
  
  const handleCompleteTask = (id: string) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      
      // Find the task that was just updated
      const updatedTask = updatedTasks.find(task => task.id === id);
      
      // Show toast notification
      if (updatedTask) {
        toast({
          title: updatedTask.completed ? "Tarefa concluída" : "Tarefa reaberta",
          description: updatedTask.title,
        });
      }
      
      return updatedTasks;
    });
  };
  
  const handleDeleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    toast({
      title: "Tarefa removida",
      description: "A tarefa foi removida com sucesso.",
      variant: "destructive"
    });
  };
  
  return {
    tasks,
    setTasks,
    handleAddTask,
    handleUpdateTask,
    handleCompleteTask,
    handleDeleteTask,
  };
}
