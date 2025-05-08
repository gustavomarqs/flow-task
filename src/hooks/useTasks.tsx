
import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { getFromStorage, saveToStorage } from '@/utils/storage';
import { getCurrentDateTime } from '@/utils/date-time';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Load tasks from Supabase
  useEffect(() => {
    async function fetchTasks() {
      if (!user) return;
      
      setLoading(true);
      try {
        // Get tasks from Supabase where user_id matches
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) {
          throw error;
        }
        
        if (data) {
          // Convert database tasks to app Task format
          const formattedTasks: Task[] = data.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description || undefined,
            category: task.category || "Geral",
            date: task.date,
            time: task.time || undefined,
            completed: task.completed,
            createdAt: task.created_at,
            timeEstimate: task.time_estimate
          }));
          
          setTasks(formattedTasks);
          
          // Also save to localStorage as fallback
          saveToStorage(`tasks_${user.id}`, formattedTasks);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        
        // Fallback to localStorage if Supabase fails
        const savedTasks = getFromStorage(`tasks_${user.id}`, []);
        if (savedTasks.length > 0) {
          setTasks(savedTasks);
        }
        
        toast({
          title: "Erro ao carregar tarefas",
          description: "Não foi possível carregar suas tarefas do servidor.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchTasks();
  }, [user?.id, toast]);
  
  // Task handlers
  const handleAddTask = async (task: Task) => {
    if (!user) return;
    
    const taskWithTimestamp = {
      ...task,
      createdAt: getCurrentDateTime() // Use current date time in ISO format
    };
    
    try {
      // Insert into Supabase
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          id: taskWithTimestamp.id,
          title: taskWithTimestamp.title,
          description: taskWithTimestamp.description,
          category: taskWithTimestamp.category,
          date: taskWithTimestamp.date,
          time: taskWithTimestamp.time,
          completed: taskWithTimestamp.completed,
          created_at: taskWithTimestamp.createdAt,
          time_estimate: taskWithTimestamp.timeEstimate,
          user_id: user.id
        }])
        .select();
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setTasks(prevTasks => [...prevTasks, taskWithTimestamp]);
      
      // Update localStorage backup
      saveToStorage(`tasks_${user.id}`, [...tasks, taskWithTimestamp]);
      
      toast({
        title: "Tarefa adicionada",
        description: "Nova tarefa adicionada com sucesso!",
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Erro ao adicionar tarefa",
        description: "Não foi possível salvar a tarefa no servidor.",
        variant: "destructive"
      });
    }
  };
  
  const handleUpdateTask = async (task: Task) => {
    if (!user) return;
    
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('tasks')
        .update({
          title: task.title,
          description: task.description,
          category: task.category,
          date: task.date,
          time: task.time,
          completed: task.completed,
          time_estimate: task.timeEstimate
        })
        .eq('id', task.id)
        .eq('user_id', user.id);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setTasks(prevTasks => prevTasks.map(t => t.id === task.id ? task : t));
      
      // Update localStorage backup
      saveToStorage(`tasks_${user.id}`, tasks.map(t => t.id === task.id ? task : t));
      
      toast({
        title: "Tarefa atualizada",
        description: "Tarefa editada com sucesso!",
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Erro ao atualizar tarefa",
        description: "Não foi possível atualizar a tarefa no servidor.",
        variant: "destructive"
      });
    }
  };
  
  const handleCompleteTask = async (id: string) => {
    if (!user) return;
    
    try {
      // Find current task
      const taskToUpdate = tasks.find(task => task.id === id);
      if (!taskToUpdate) return;
      
      // Toggle completion status
      const completed = !taskToUpdate.completed;
      
      // Current date-time for completion
      const completedAt = completed ? getCurrentDateTime() : undefined;
      
      // Update in Supabase
      const { error } = await supabase
        .from('tasks')
        .update({
          completed,
          completed_at: completedAt
        })
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setTasks(prevTasks => {
        const updatedTasks = prevTasks.map(task => 
          task.id === id ? 
          { 
            ...task, 
            completed,
            completedAt
          } : task
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
      
      // Update localStorage backup
      saveToStorage(`tasks_${user.id}`, tasks.map(task => 
        task.id === id ? 
        { 
          ...task, 
          completed,
          completedAt
        } : task
      ));
      
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: "Erro ao atualizar tarefa",
        description: "Não foi possível atualizar o status da tarefa no servidor.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteTask = async (id: string) => {
    if (!user) return;
    
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      
      // Update localStorage backup
      saveToStorage(`tasks_${user.id}`, tasks.filter(task => task.id !== id));
      
      toast({
        title: "Tarefa removida",
        description: "A tarefa foi removida com sucesso.",
        variant: "destructive"
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Erro ao remover tarefa",
        description: "Não foi possível remover a tarefa do servidor.",
        variant: "destructive"
      });
    }
  };
  
  return {
    tasks,
    loading,
    setTasks,
    handleAddTask,
    handleUpdateTask,
    handleCompleteTask,
    handleDeleteTask,
  };
}
