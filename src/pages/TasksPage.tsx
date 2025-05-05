
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { TaskForm } from '@/components/TaskForm';
import { TaskHistoryModal } from '@/components/TaskHistoryModal';
import { WeeklyProgressCard } from '@/components/WeeklyProgressCard';
import { FocusMode } from '@/components/FocusMode';
import { SearchBar } from '@/components/SearchBar';
import { TasksContent } from '@/components/TasksContent';
import { Task } from '@/types/task';
import { RecurringTask, RecurringTaskEntry } from '@/types/recurring-task';
import { getFromStorage, saveToStorage, getCategoryColors } from '@/utils/storage';
import { useToast } from "@/components/ui/use-toast";

export default function TasksPage() {
  // Regular tasks state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryColors, setCategoryColors] = useState<Record<string, string>>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Recurring tasks state
  const [recurringTasks, setRecurringTasks] = useState<RecurringTask[]>([]);
  const [taskEntries, setTaskEntries] = useState<RecurringTaskEntry[]>([]);
  const [editingRecurringTask, setEditingRecurringTask] = useState<RecurringTask | null>(null);
  const [historyTask, setHistoryTask] = useState<RecurringTask | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  // Focus mode state
  const [focusTask, setFocusTask] = useState<{
    type: 'regular' | 'recurring';
    task: Task | RecurringTask;
  } | null>(null);
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Toast
  const { toast } = useToast();

  // Load data from localStorage
  useEffect(() => {
    // Load tasks
    const savedTasks = getFromStorage('tasks', []);
    if (savedTasks.length > 0) {
      setTasks(savedTasks);
    }
    
    // Load categories
    const savedCategories = getFromStorage('categories', ["Treinos", "Estudos"]);
    if (savedCategories.length > 0) {
      setCategories(savedCategories);
      
      // Load category colors
      const colors = getCategoryColors(savedCategories);
      setCategoryColors(colors);
    }
    
    // Load recurring tasks
    const savedRecurringTasks = getFromStorage('recurringTasks', []);
    if (savedRecurringTasks.length > 0) {
      setRecurringTasks(savedRecurringTasks);
    }
    
    // Load task entries
    const savedEntries = getFromStorage('taskEntries', []);
    if (savedEntries.length > 0) {
      setTaskEntries(savedEntries);
    }
    
    // Reset task entries for a new day
    resetRecurringTasksForNewDay();
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveToStorage('tasks', tasks);
  }, [tasks]);

  useEffect(() => {
    saveToStorage('recurringTasks', recurringTasks);
  }, [recurringTasks]);

  useEffect(() => {
    saveToStorage('taskEntries', taskEntries);
  }, [taskEntries]);

  useEffect(() => {
    // Update category colors when categories change
    const colors = getCategoryColors(categories);
    setCategoryColors(colors);
  }, [categories]);
  
  // Reset recurring tasks for new day
  const resetRecurringTasksForNewDay = () => {
    const today = new Date().toISOString().split('T')[0];
    const lastUsedDate = getFromStorage('lastUsedDate', '');
    
    // If it's a new day
    if (lastUsedDate !== today) {
      // Update last used date
      saveToStorage('lastUsedDate', today);
      
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

  // Task handlers
  const handleAddTask = () => {
    setEditingTask(null);
    setEditingRecurringTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditingRecurringTask(null);
    setIsFormOpen(true);
  };

  const handleEditRecurringTask = (task: RecurringTask) => {
    setEditingTask(null);
    setEditingRecurringTask(task);
    setIsFormOpen(true);
  };

  const handleSaveTask = (task: Task) => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === task.id ? task : t));
      toast({
        title: "Tarefa atualizada",
        description: "Tarefa editada com sucesso!",
      });
    } else {
      setTasks([...tasks, task]);
      toast({
        title: "Tarefa adicionada",
        description: "Nova tarefa adicionada com sucesso!",
      });
    }
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleSaveRecurringTask = (task: RecurringTask) => {
    if (editingRecurringTask) {
      setRecurringTasks(recurringTasks.map(t => t.id === task.id ? task : t));
      toast({
        title: "Tarefa recorrente atualizada",
        description: "Tarefa recorrente editada com sucesso!",
      });
    } else {
      setRecurringTasks([...recurringTasks, task]);
      toast({
        title: "Tarefa recorrente adicionada",
        description: "Nova tarefa recorrente adicionada com sucesso!",
      });
    }
    setIsFormOpen(false);
    setEditingRecurringTask(null);
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
    setTasks(tasks.filter(task => task.id !== id));
    toast({
      title: "Tarefa removida",
      description: "A tarefa foi removida com sucesso.",
      variant: "destructive"
    });
  };

  const handleDeleteRecurringTask = (id: string) => {
    setRecurringTasks(recurringTasks.filter(task => task.id !== id));
    // Also delete all entries for this task
    setTaskEntries(taskEntries.filter(entry => entry.recurringTaskId !== id));
    toast({
      title: "Tarefa recorrente removida",
      description: "A tarefa recorrente foi removida com sucesso.",
      variant: "destructive"
    });
  };

  const handleCompleteRecurringTask = (entry: RecurringTaskEntry) => {
    // Check if there's already an entry for today's task
    const existingEntryIndex = taskEntries.findIndex(e => 
      e.recurringTaskId === entry.recurringTaskId && e.date === entry.date
    );
    
    if (existingEntryIndex >= 0) {
      // Update existing entry
      const newEntries = [...taskEntries];
      // Toggle completion status
      const isCompleted = !newEntries[existingEntryIndex].completed;
      newEntries[existingEntryIndex] = {
        ...newEntries[existingEntryIndex],
        completed: isCompleted
      };
      setTaskEntries(newEntries);
      
      // Update lastCompletedDate in the recurring task if completed
      if (isCompleted) {
        setRecurringTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === entry.recurringTaskId ? 
              { ...task, lastCompletedDate: entry.date } : 
              task
          )
        );
        
        toast({
          title: "Tarefa concluída",
          description: entry.title
        });
      } else {
        toast({
          title: "Tarefa reaberta",
          description: entry.title
        });
      }
    } else {
      // Add new entry
      setTaskEntries([...taskEntries, entry]);
      
      // Update lastCompletedDate in the recurring task
      setRecurringTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === entry.recurringTaskId ? 
            { ...task, lastCompletedDate: entry.date } : 
            task
        )
      );
      
      toast({
        title: "Tarefa concluída",
        description: entry.title
      });
    }
  };

  const handleViewTaskHistory = (taskId: string) => {
    const task = recurringTasks.find(t => t.id === taskId);
    if (task) {
      setHistoryTask(task);
      setIsHistoryOpen(true);
    }
  };

  // Add a new category
  const handleAddCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  // Start focus mode
  const handleStartFocus = (taskType: 'regular' | 'recurring', task: Task | RecurringTask) => {
    setFocusTask({ type: taskType, task });
    setIsFocusModeOpen(true);
  };
  
  const handleCategoryClick = (category: string) => {
    setActiveTab(`category-${category}`);
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    // Filter by search query
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by tab
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "completed") return matchesSearch && task.completed;
    if (activeTab === "pending") return matchesSearch && !task.completed;
    if (activeTab.startsWith("category-")) {
      const categoryFilter = activeTab.replace("category-", "");
      return matchesSearch && task.category === categoryFilter;
    }
    
    return matchesSearch;
  });

  // Filter recurring tasks
  const filteredRecurringTasks = recurringTasks.filter(task => {
    // Filter by search query
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by active status
    if (!task.active) return false;
    
    // Filter by tab
    if (activeTab === "all") return matchesSearch;
    if (activeTab.startsWith("category-")) {
      const categoryFilter = activeTab.replace("category-", "");
      return matchesSearch && task.category === categoryFilter;
    }
    
    return matchesSearch;
  });

  // Helper function to get task entries for a specific recurring task
  const getEntriesForTask = (taskId: string) => {
    return taskEntries.filter(entry => entry.recurringTaskId === taskId);
  };
  
  // Get today's entries for recurring tasks
  const getTodaysEntries = () => {
    const today = new Date().toISOString().split('T')[0];
    return taskEntries.filter(entry => entry.date === today);
  };

  return (
    <div className="animate-fade-in space-y-8">
      <PageHeader 
        title="Minhas Tarefas"
        action={handleAddTask}
        actionLabel="Nova Tarefa"
        buttonClassName="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-full shadow-md transition-all duration-200 hover:scale-105"
      />
      
      <WeeklyProgressCard 
        entries={taskEntries}
        tasks={tasks}
        categories={categories}
        categoryColors={categoryColors}
      />
      
      <SearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <TasksContent 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        categories={categories}
        filteredTasks={filteredTasks}
        filteredRecurringTasks={filteredRecurringTasks}
        taskEntries={getTodaysEntries()}
        categoryColors={categoryColors}
        onCategoryClick={handleCategoryClick}
        onCompleteTask={handleCompleteTask}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onCompleteRecurringTask={handleCompleteRecurringTask}
        onEditRecurringTask={handleEditRecurringTask}
        onDeleteRecurringTask={handleDeleteRecurringTask}
        onViewTaskHistory={handleViewTaskHistory}
        onStartFocus={handleStartFocus}
      />
      
      {/* Forms and modals */}
      <TaskForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSaveTask={handleSaveTask}
        onSaveRecurringTask={handleSaveRecurringTask}
        editTask={editingTask}
        editRecurringTask={editingRecurringTask}
        categories={categories}
        onAddCategory={handleAddCategory}
      />
      
      <TaskHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        task={historyTask}
        entries={historyTask ? getEntriesForTask(historyTask.id) : []}
      />
      
      <FocusMode
        selectedTask={focusTask}
        isOpen={isFocusModeOpen}
        onClose={() => setIsFocusModeOpen(false)}
        onCompleteTask={handleCompleteTask}
        onCompleteRecurringTask={handleCompleteRecurringTask}
        categoryColors={categoryColors}
      />
    </div>
  );
}
