
import { useState } from 'react';
import { Task } from '@/types/task';
import { RecurringTask } from '@/types/recurring-task';

export function useTaskFilters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Filter tasks
  const filterTasks = (tasks: Task[]) => {
    return tasks.filter(task => {
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
  };

  // Filter recurring tasks
  const filterRecurringTasks = (recurringTasks: RecurringTask[]) => {
    return recurringTasks.filter(task => {
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
  };
  
  const handleCategoryClick = (category: string) => {
    setActiveTab(`category-${category}`);
  };

  return {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    filterTasks,
    filterRecurringTasks,
    handleCategoryClick
  };
}
