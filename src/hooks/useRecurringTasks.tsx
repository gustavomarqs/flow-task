
import { useState, useEffect } from 'react';
import { RecurringTask, RecurringTaskEntry } from '@/types/recurring-task';
import { getFromStorage, saveToStorage } from '@/utils/storage';
import { getCurrentDateTime, getCurrentDate } from '@/utils/date-time';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/auth/AuthProvider';

export function useRecurringTasks() {
  const [recurringTasks, setRecurringTasks] = useState<RecurringTask[]>([]);
  const [taskEntries, setTaskEntries] = useState<RecurringTaskEntry[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Load recurring tasks and entries from localStorage
  useEffect(() => {
    if (user) {
      const savedRecurringTasks = getFromStorage(`recurringTasks_${user.id}`, []);
      if (savedRecurringTasks.length > 0) {
        setRecurringTasks(savedRecurringTasks);
      }
      
      const savedEntries = getFromStorage(`taskEntries_${user.id}`, []);
      if (savedEntries.length > 0) {
        setTaskEntries(savedEntries);
      }
      
      // Reset recurring tasks for a new day
      resetRecurringTasksForNewDay();
    }
  }, [user?.id]);
  
  // Save recurring tasks to localStorage
  useEffect(() => {
    if (user) {
      saveToStorage(`recurringTasks_${user.id}`, recurringTasks);
    }
  }, [recurringTasks, user?.id]);
  
  // Save task entries to localStorage
  useEffect(() => {
    if (user) {
      saveToStorage(`taskEntries_${user.id}`, taskEntries);
    }
  }, [taskEntries, user?.id]);
  
  // Reset recurring tasks for new day
  const resetRecurringTasksForNewDay = () => {
    if (!user) return;
    
    const today = getCurrentDate();
    const lastUsedDate = getFromStorage(`lastUsedDate_${user.id}`, '');
    
    // If it's a new day
    if (lastUsedDate !== today) {
      // Update last used date
      saveToStorage(`lastUsedDate_${user.id}`, today);
      
      // Update recurring tasks with last completed date
      const updatedRecurringTasks = recurringTasks.map(task => {
        const entries = taskEntries.filter(entry => entry.recurringTaskId === task.id);
        if (entries.length > 0) {
          // Find most recent completed entry
          const lastCompleted = entries
            .filter(entry => entry.completed)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
            
          if (lastCompleted) {
            return {
              ...task,
              lastCompletedDate: lastCompleted.date
            };
          }
        }
        return task;
      });
      
      setRecurringTasks(updatedRecurringTasks);
    }
  };
  
  const handleAddRecurringTask = (task: RecurringTask) => {
    const taskWithTimestamp = {
      ...task,
      createdAt: task.createdAt || getCurrentDateTime()
    };
    
    setRecurringTasks(prevTasks => [...prevTasks, taskWithTimestamp]);
    toast({
      title: "Tarefa recorrente adicionada",
      description: "Nova tarefa recorrente adicionada com sucesso!",
    });
  };
  
  const handleUpdateRecurringTask = (task: RecurringTask) => {
    setRecurringTasks(prevTasks => prevTasks.map(t => t.id === task.id ? task : t));
    toast({
      title: "Tarefa recorrente atualizada",
      description: "Tarefa recorrente editada com sucesso!",
    });
  };
  
  const handleCompleteRecurringTask = (entry: RecurringTaskEntry) => {
    // Make sure entry has createdAt timestamp
    const entryWithTimestamp = {
      ...entry,
      createdAt: entry.createdAt || getCurrentDateTime(),
      // Ensure we have the current date (not UTC which could cause day differences)
      date: entry.date || getCurrentDate()
    };
    
    // Check if there's already an entry for today's task
    const existingEntryIndex = taskEntries.findIndex(e => 
      e.recurringTaskId === entryWithTimestamp.recurringTaskId && e.date === entryWithTimestamp.date
    );
    
    if (existingEntryIndex >= 0) {
      // Update existing entry
      const newEntries = [...taskEntries];
      // Toggle completion status
      const isCompleted = !newEntries[existingEntryIndex].completed;
      newEntries[existingEntryIndex] = {
        ...newEntries[existingEntryIndex],
        completed: isCompleted,
        // Preserve the details if the task is being marked as complete again
        details: isCompleted ? (entryWithTimestamp.details || newEntries[existingEntryIndex].details) : newEntries[existingEntryIndex].details,
        category: entryWithTimestamp.category || newEntries[existingEntryIndex].category
      };
      setTaskEntries(newEntries);
      
      // Update lastCompletedDate in the recurring task if completed
      if (isCompleted) {
        setRecurringTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === entryWithTimestamp.recurringTaskId ? 
              { ...task, lastCompletedDate: entryWithTimestamp.date } : 
              task
          )
        );
        
        toast({
          title: "Tarefa concluída",
          description: entryWithTimestamp.title
        });
      } else {
        toast({
          title: "Tarefa reaberta",
          description: entryWithTimestamp.title
        });
      }
    } else {
      // Add new entry
      setTaskEntries(prevEntries => [...prevEntries, entryWithTimestamp]);
      
      // Update lastCompletedDate in the recurring task
      setRecurringTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === entryWithTimestamp.recurringTaskId ? 
            { ...task, lastCompletedDate: entryWithTimestamp.date } : 
            task
        )
      );
      
      toast({
        title: "Tarefa concluída",
        description: entryWithTimestamp.title
      });
    }
  };
  
  const handleDeleteRecurringTask = (id: string) => {
    setRecurringTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    // Also delete all entries for this task
    setTaskEntries(prevEntries => prevEntries.filter(entry => entry.recurringTaskId !== id));
    toast({
      title: "Tarefa recorrente removida",
      description: "A tarefa recorrente foi removida com sucesso.",
      variant: "destructive"
    });
  };
  
  // Helper function to get task entries for a specific recurring task
  const getEntriesForTask = (taskId: string) => {
    return taskEntries.filter(entry => entry.recurringTaskId === taskId);
  };
  
  // Get today's entries for recurring tasks
  const getTodaysEntries = () => {
    const today = getCurrentDate();
    return taskEntries.filter(entry => entry.date === today);
  };
  
  return {
    recurringTasks,
    taskEntries,
    setRecurringTasks,
    setTaskEntries,
    handleAddRecurringTask,
    handleUpdateRecurringTask,
    handleCompleteRecurringTask,
    handleDeleteRecurringTask,
    getEntriesForTask,
    getTodaysEntries
  };
}
