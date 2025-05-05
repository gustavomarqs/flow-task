
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Tag, Trash2 } from 'lucide-react';
import { saveToStorage, getFromStorage, getCategoryColors } from '@/utils/storage';
import { AccountSettings } from '@/components/settings/AccountSettings';
import { CategorySection } from '@/components/settings/CategorySection';
import { DataManagement } from '@/components/settings/DataManagement';

const defaultCategories = ["Treinos", "Estudos"];

export default function ConfiguracoesPage() {
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [categoryColors, setCategoryColors] = useState<Record<string, string>>({});
  
  // Carregar categorias e cores do localStorage
  useEffect(() => {
    const savedCategories = getFromStorage<string[]>('categories', defaultCategories);
    setCategories(savedCategories);
    
    // Load category colors
    const colors = getCategoryColors(savedCategories);
    setCategoryColors(colors);
  }, []);

  // Salvar categorias no localStorage quando mudam
  useEffect(() => {
    saveToStorage('categories', categories);
  }, [categories]);

  // Salvar cores das categorias quando mudam
  useEffect(() => {
    saveToStorage('categoryColors', categoryColors);
  }, [categoryColors]);

  const handleAddCategory = (category: string, color: string) => {
    setCategories(prev => [...prev, category]);
    setCategoryColors(prev => ({...prev, [category]: color}));
  };

  const handleRemoveCategory = (category: string) => {
    setCategories(prev => prev.filter(c => c !== category));
    
    // Remove color for this category
    const updatedColors = {...categoryColors};
    delete updatedColors[category];
    setCategoryColors(updatedColors);
    
    // Atualizar tarefas associadas a esta categoria
    const savedTasks = getFromStorage('tasks', []);
    const updatedTasks = savedTasks.map((task: any) => {
      if (task.category === category) {
        return { ...task, category: "Geral" };
      }
      return task;
    });
    saveToStorage('tasks', updatedTasks);
    
    // Atualizar tarefas recorrentes associadas a esta categoria
    const savedRecurringTasks = getFromStorage('recurringTasks', []);
    const updatedRecurringTasks = savedRecurringTasks.map((task: any) => {
      if (task.category === category) {
        return { ...task, category: "Geral" };
      }
      return task;
    });
    saveToStorage('recurringTasks', updatedRecurringTasks);
  };

  const handleUpdateCategoryColor = (category: string, color: string) => {
    setCategoryColors(prev => ({...prev, [category]: color}));
  };

  const handleResetData = () => {
    setCategories(defaultCategories);
    const defaultColors = getCategoryColors(defaultCategories);
    setCategoryColors(defaultColors);
    saveToStorage('categories', defaultCategories);
    saveToStorage('categoryColors', defaultColors);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Configurações" 
        description="Gerencie suas preferências e dados"
        showAddButton={false} 
      />
      
      <Tabs defaultValue="categorias" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="conta">
            <User className="mr-2 h-4 w-4" />
            Conta
          </TabsTrigger>
          <TabsTrigger value="categorias">
            <Tag className="mr-2 h-4 w-4" />
            Categorias
          </TabsTrigger>
          <TabsTrigger value="dados">
            <Trash2 className="mr-2 h-4 w-4" />
            Gerenciamento de Dados
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="conta">
          <AccountSettings />
        </TabsContent>
        
        <TabsContent value="categorias">
          <CategorySection
            categories={categories}
            categoryColors={categoryColors}
            onAddCategory={handleAddCategory}
            onRemoveCategory={handleRemoveCategory}
            onUpdateCategoryColor={handleUpdateCategoryColor}
          />
        </TabsContent>
        
        <TabsContent value="dados">
          <DataManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
