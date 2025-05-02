
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { RecurringTaskForm } from '@/components/RecurringTaskForm';
import { RecurringTaskCard } from '@/components/RecurringTaskCard';
import { TaskHistoryModal } from '@/components/TaskHistoryModal';
import { WeeklyProgressCard } from '@/components/WeeklyProgressCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/task';
import { RecurringTask, RecurringTaskEntry } from '@/types/recurring-task';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { startOfDay } from 'date-fns';

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
  const [isRecurringFormOpen, setIsRecurringFormOpen] = useState(false);
  const [editingRecurringTask, setEditingRecurringTask] = useState<RecurringTask | null>(null);
  const [historyTask, setHistoryTask] = useState<RecurringTask | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [mainTab, setMainTab] = useState("regular"); // "regular" or "recurring"
  
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

  // Regular tasks handlers
  const handleAddTask = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
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

  const handleCompleteTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Recurring tasks handlers
  const handleAddRecurringTask = () => {
    setEditingRecurringTask(null);
    setIsRecurringFormOpen(true);
  };

  const handleEditRecurringTask = (task: RecurringTask) => {
    setEditingRecurringTask(task);
    setIsRecurringFormOpen(true);
  };

  const handleSaveRecurringTask = (task: RecurringTask) => {
    if (editingRecurringTask) {
      setRecurringTasks(recurringTasks.map(t => t.id === task.id ? task : t));
    } else {
      setRecurringTasks([...recurringTasks, task]);
    }
    setIsRecurringFormOpen(false);
    setEditingRecurringTask(null);
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

  // Get today's entries for recurring tasks
  const today = new Date().toISOString().split('T')[0];
  const todaysEntries = taskEntries.filter(entry => entry.date === today);

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter(task => {
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
    })
    .sort((a, b) => {
      // Sort by date (newest first)
      const dateA = new Date(`${a.date}T${a.time || "00:00"}`).getTime();
      const dateB = new Date(`${b.date}T${b.time || "00:00"}`).getTime();
      return dateA - dateB;
    });

  // Filter recurring tasks
  const filteredRecurringTasks = recurringTasks
    .filter(task => {
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

  // Helper function to get today's entry for a recurring task
  const getTodaysEntryForTask = (taskId: string) => {
    return todaysEntries.find(entry => entry.recurringTaskId === taskId) || null;
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Minhas Tarefas"
        action={mainTab === "regular" ? handleAddTask : handleAddRecurringTask}
        actionLabel={mainTab === "regular" ? "Nova Tarefa" : "Nova Tarefa Recorrente"}
      />
      
      {/* Main tabs for regular vs recurring tasks */}
      <Tabs value={mainTab} onValueChange={setMainTab} className="mb-4">
        <TabsList className="w-full bg-dark-gray">
          <TabsTrigger value="regular" className="flex-1">Tarefas</TabsTrigger>
          <TabsTrigger value="recurring" className="flex-1">Tarefas Recorrentes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="regular" className="mt-4 space-y-4">
          {renderRegularTasksTab()}
        </TabsContent>
        
        <TabsContent value="recurring" className="mt-4 space-y-4">
          {renderRecurringTasksTab()}
        </TabsContent>
      </Tabs>
      
      {/* Forms and modals */}
      <TaskForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveTask}
        editTask={editingTask}
        categories={categories}
        onAddCategory={handleAddCategory}
      />
      
      <RecurringTaskForm 
        isOpen={isRecurringFormOpen}
        onClose={() => setIsRecurringFormOpen(false)}
        onSave={handleSaveRecurringTask}
        editTask={editingRecurringTask}
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

  // Helper function to render the regular tasks tab content
  function renderRegularTasksTab() {
    return (
      <>
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

          {/* TabsContent components for each tab */}
          <TabsContent value="all" className="mt-2">
            {renderTasksList()}
          </TabsContent>
          <TabsContent value="pending" className="mt-2">
            {renderTasksList()}
          </TabsContent>
          <TabsContent value="completed" className="mt-2">
            {renderTasksList()}
          </TabsContent>
          {categories.map(category => (
            <TabsContent key={category} value={`category-${category}`} className="mt-2">
              {renderTasksList()}
            </TabsContent>
          ))}
        </Tabs>
      </>
    );
  }
  
  // Helper function to render the recurring tasks tab content
  function renderRecurringTasksTab() {
    return (
      <>
        <WeeklyProgressCard entries={taskEntries} categories={categories} />
        
        <div className="mb-4">
          <Input
            placeholder="Pesquisar tarefas recorrentes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-medium-gray"
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-dark-gray">
            <TabsTrigger value="all">Todas</TabsTrigger>
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

          {/* TabsContent components */}
          <TabsContent value="all" className="mt-2">
            {renderRecurringTasksList()}
          </TabsContent>
          {categories.map(category => (
            <TabsContent key={category} value={`category-${category}`} className="mt-2">
              {renderRecurringTasksList()}
            </TabsContent>
          ))}
        </Tabs>
      </>
    );
  }

  // Helper function to render the tasks list
  function renderTasksList() {
    return filteredTasks.length > 0 ? (
      <div>
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={handleCompleteTask}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>
    ) : (
      <div className="text-center py-12 border border-dashed border-gray-700 rounded-lg">
        <p className="text-gray-400">
          {searchQuery 
            ? "Nenhuma tarefa encontrada para sua pesquisa." 
            : "Nenhuma tarefa adicionada ainda. Comece adicionando uma nova tarefa!"}
        </p>
      </div>
    );
  }
  
  // Helper function to render the recurring tasks list
  function renderRecurringTasksList() {
    return filteredRecurringTasks.length > 0 ? (
      <div>
        {filteredRecurringTasks.map((task) => (
          <RecurringTaskCard
            key={task.id}
            task={task}
            todaysEntry={getTodaysEntryForTask(task.id)}
            onComplete={handleCompleteRecurringTask}
            onEdit={handleEditRecurringTask}
            onDelete={handleDeleteRecurringTask}
            onViewHistory={handleViewTaskHistory}
          />
        ))}
      </div>
    ) : (
      <div className="text-center py-12 border border-dashed border-gray-700 rounded-lg">
        <p className="text-gray-400">
          {searchQuery 
            ? "Nenhuma tarefa recorrente encontrada para sua pesquisa." 
            : "Nenhuma tarefa recorrente adicionada ainda. Comece adicionando uma nova tarefa recorrente!"}
        </p>
      </div>
    );
  }
}
