
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TabFiltersProps {
  activeTab: string;
}

export function TabFilters({ activeTab }: TabFiltersProps) {
  return (
    <TabsList className="bg-zinc-800/80 p-1 mb-4">
      <TabsTrigger 
        value="all"
        className={`transition-all duration-200 hover:scale-105 ${activeTab === 'all' ? 'bg-cyan-700 text-white' : ''}`}
      >
        Todas
      </TabsTrigger>
      <TabsTrigger 
        value="pending"
        className={`transition-all duration-200 hover:scale-105 ${activeTab === 'pending' ? 'bg-cyan-700 text-white' : ''}`}
      >
        Pendentes
      </TabsTrigger>
      <TabsTrigger 
        value="completed"
        className={`transition-all duration-200 hover:scale-105 ${activeTab === 'completed' ? 'bg-cyan-700 text-white' : ''}`}
      >
        Concluídas
      </TabsTrigger>
    </TabsList>
  );
}
