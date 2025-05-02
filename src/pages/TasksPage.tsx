
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { Input } from '@/components/ui/input';
import { Task } from '@/types/task';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const defaultCategories = ["Treinos", "Estudos"];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Load tasks from localStorage
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    
    // Load categories from localStorage
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  useEffect(() => {
    // Save tasks to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    // Save categories to localStorage
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

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

  const handleAddCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

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

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Minhas Tarefas"
        action={handleAddTask}
        actionLabel="Nova Tarefa"
      />
      
      <div className="mb-6">
        <Input
          placeholder="Pesquisar tarefas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-medium-gray"
        />
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-dark-gray">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="completed">Concluídas</TabsTrigger>
        </TabsList>
        
        <div className="mt-2 flex flex-wrap gap-2">
          {categories.map(category => (
            <TabsTrigger 
              key={category}
              value={`category-${category}`}
              className="data-[state=active]:bg-neon data-[state=active]:text-deep-dark"
              onClick={() => setActiveTab(`category-${category}`)}
            >
              {category}
            </TabsTrigger>
          ))}
        </div>
      </Tabs>

      {filteredTasks.length > 0 ? (
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
      )}
      
      <TaskForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveTask}
        editTask={editingTask}
        categories={categories}
        onAddCategory={handleAddCategory}
      />
    </div>
  );
}
