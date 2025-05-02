
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { TaskForm } from '@/components/TaskForm';
import { TaskHistoryModal } from '@/components/TaskHistoryModal';
import { WeeklyProgressCard } from '@/components/WeeklyProgressCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/task';
import { RecurringTask, RecurringTaskEntry } from '@/types/recurring-task';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnifiedTaskList } from '@/components/UnifiedTaskList';

const defaultCategories = ["Treinos", "Estudos"];

export default function TasksPage() {
  // Regular tasks state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Recurring tasks state
  const [recurringTasks, setRecurringTasks] = useState<RecurringTask[]>([]);
  const [taskEntries, setTaskEntries] = useState<RecurringTaskEntry[]>([]);
  const [editingRecurringTask, setEditingRecurringTask] = useState<RecurringTask | null>(null);
  const [historyTask, setHistoryTask] = useState<RecurringTask | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Load data from localStorage
  useEffect(() => {
    // Load tasks
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    
    // Load categories
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
    
    // Load recurring tasks
    const savedRecurringTasks = localStorage.getItem('recurringTasks');
    if (savedRecurringTasks) {
      setRecurringTasks(JSON.parse(savedRecurringTasks));
    }
    
    // Load task entries
    const savedEntries = localStorage.getItem('taskEntries');
    if (savedEntries) {
      setTaskEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('recurringTasks', JSON.stringify(recurringTasks));
  }, [recurringTasks]);

  useEffect(() => {
    localStorage.setItem('taskEntries', JSON.stringify(taskEntries));
  }, [taskEntries]);

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
    } else {
      setTasks([...tasks, task]);
    }
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleSaveRecurringTask = (task: RecurringTask) => {
    if (editingRecurringTask) {
      setRecurringTasks(recurringTasks.map(t => t.id === task.id ? task : t));
    } else {
      setRecurringTasks([...recurringTasks, task]);
    }
    setIsFormOpen(false);
    setEditingRecurringTask(null);
  };

  const handleCompleteTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleDeleteRecurringTask = (id: string) => {
    setRecurringTasks(recurringTasks.filter(task => task.id !== id));
    // Also delete all entries for this task
    setTaskEntries(taskEntries.filter(entry => entry.recurringTaskId !== id));
  };

  const handleCompleteRecurringTask = (entry: RecurringTaskEntry) => {
    // Check if there's already an entry for today's task
    const existingEntryIndex = taskEntries.findIndex(e => e.id === entry.id);
    
    if (existingEntryIndex >= 0) {
      // Update existing entry
      setTaskEntries([
        ...taskEntries.slice(0, existingEntryIndex),
        entry,
        ...taskEntries.slice(existingEntryIndex + 1)
      ]);
    } else {
      // Add new entry
      setTaskEntries([...taskEntries, entry]);
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

  const handleCategoryClick = (category: string) => {
    setActiveTab(`category-${category}`);
  };

  // Helper function to get task entries for a specific recurring task
  const getEntriesForTask = (taskId: string) => {
    return taskEntries.filter(entry => entry.recurringTaskId === taskId);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Minhas Tarefas"
        action={handleAddTask}
        actionLabel="Nova Tarefa"
      />
      
      <WeeklyProgressCard 
        entries={taskEntries} 
        categories={categories}
        className="mb-6" 
      />
      
      <div className="mb-4">
        <Input
          placeholder="Pesquisar tarefas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-medium-gray"
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-dark-gray">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="completed">Concluídas</TabsTrigger>
        </TabsList>
        
        {/* Category filters */}
        <div className="mt-2 flex flex-wrap gap-2">
          {categories.map(category => (
            <button 
              key={category}
              className={`px-3 py-1.5 text-sm rounded-sm ${
                activeTab === `category-${category}` 
                  ? 'bg-neon text-deep-dark' 
                  : 'bg-muted text-muted-foreground'
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* TabsContent for all tabs */}
        <TabsContent value="all" className="mt-2">
          <UnifiedTaskList
            regularTasks={filteredTasks}
            recurringTasks={filteredRecurringTasks}
            taskEntries={taskEntries}
            onCompleteTask={handleCompleteTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onCompleteRecurringTask={handleCompleteRecurringTask}
            onEditRecurringTask={handleEditRecurringTask}
            onDeleteRecurringTask={handleDeleteRecurringTask}
            onViewTaskHistory={handleViewTaskHistory}
          />
        </TabsContent>
        
        <TabsContent value="pending" className="mt-2">
          <UnifiedTaskList
            regularTasks={filteredTasks.filter(task => !task.completed)}
            recurringTasks={filteredRecurringTasks}
            taskEntries={taskEntries}
            onCompleteTask={handleCompleteTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onCompleteRecurringTask={handleCompleteRecurringTask}
            onEditRecurringTask={handleEditRecurringTask}
            onDeleteRecurringTask={handleDeleteRecurringTask}
            onViewTaskHistory={handleViewTaskHistory}
          />
        </TabsContent>
        
        <TabsContent value="completed" className="mt-2">
          <UnifiedTaskList
            regularTasks={filteredTasks.filter(task => task.completed)}
            recurringTasks={[]} // Não mostramos tarefas recorrentes na aba de concluídas
            taskEntries={taskEntries}
            onCompleteTask={handleCompleteTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onCompleteRecurringTask={handleCompleteRecurringTask}
            onEditRecurringTask={handleEditRecurringTask}
            onDeleteRecurringTask={handleDeleteRecurringTask}
            onViewTaskHistory={handleViewTaskHistory}
          />
        </TabsContent>
        
        {categories.map(category => (
          <TabsContent key={category} value={`category-${category}`} className="mt-2">
            <UnifiedTaskList
              regularTasks={filteredTasks.filter(task => task.category === category)}
              recurringTasks={filteredRecurringTasks.filter(task => task.category === category)}
              taskEntries={taskEntries}
              onCompleteTask={handleCompleteTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onCompleteRecurringTask={handleCompleteRecurringTask}
              onEditRecurringTask={handleEditRecurringTask}
              onDeleteRecurringTask={handleDeleteRecurringTask}
              onViewTaskHistory={handleViewTaskHistory}
            />
          </TabsContent>
        ))}
      </Tabs>
      
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
    </div>
  );
}
