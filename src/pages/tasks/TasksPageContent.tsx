
import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import { SearchBar } from '@/components/SearchBar';
import { TasksContent } from '@/components/tasks-content/TasksContent';
import { CollapsibleWeeklyProgressCard } from '@/components/CollapsibleWeeklyProgressCard';

interface TasksPageContentProps {
  tasks: React.ComponentProps<typeof TasksContent>;
  search: {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
  };
  onAddTask: () => void;
  weeklyProgress: {
    entries: any[];
    tasks: any[];
    categories: string[];
    categoryColors: Record<string, string>;
  };
}

export function TasksPageContent({
  tasks,
  search,
  onAddTask,
  weeklyProgress
}: TasksPageContentProps) {
  return (
    <div className="animate-fade-in space-y-8">
      <PageHeader 
        title="Minhas Tarefas"
        action={onAddTask}
        actionLabel="Nova Tarefa"
        buttonClassName="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-full shadow-md transition-all duration-200 hover:scale-105"
      />
      
      <CollapsibleWeeklyProgressCard 
        entries={weeklyProgress.entries}
        tasks={weeklyProgress.tasks}
        categories={weeklyProgress.categories}
        categoryColors={weeklyProgress.categoryColors}
      />
      
      <SearchBar 
        searchQuery={search.searchQuery}
        setSearchQuery={search.setSearchQuery}
      />
      
      <TasksContent 
        activeTab={tasks.activeTab}
        setActiveTab={tasks.setActiveTab}
        categories={tasks.categories}
        filteredTasks={tasks.filteredTasks}
        filteredRecurringTasks={tasks.filteredRecurringTasks}
        taskEntries={tasks.taskEntries}
        categoryColors={tasks.categoryColors}
        onCategoryClick={tasks.onCategoryClick}
        onCompleteTask={tasks.onCompleteTask}
        onEditTask={tasks.onEditTask}
        onDeleteTask={tasks.onDeleteTask}
        onCompleteRecurringTask={tasks.onCompleteRecurringTask}
        onEditRecurringTask={tasks.onEditRecurringTask}
        onDeleteRecurringTask={tasks.onDeleteRecurringTask}
        onViewTaskHistory={tasks.onViewTaskHistory}
        onStartFocus={tasks.onStartFocus}
      />
    </div>
  );
}
