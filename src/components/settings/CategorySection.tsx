
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryManager } from '@/components/CategoryManager';

interface CategorySectionProps {
  categories: string[];
  categoryColors: Record<string, string>;
  onAddCategory: (category: string, color: string) => void;
  onRemoveCategory: (category: string) => void;
  onUpdateCategoryColor: (category: string, color: string) => void;
}

export function CategorySection({ 
  categories, 
  categoryColors, 
  onAddCategory, 
  onRemoveCategory, 
  onUpdateCategoryColor 
}: CategorySectionProps) {
  return (
    <Card className="bg-zinc-900/90 rounded-2xl shadow-md">
      <CardHeader className="pb-2 pt-6">
        <CardTitle className="text-xl font-bold text-white/90">Gerenciamento de Categorias</CardTitle>
        <CardDescription>Adicione, edite ou remova categorias para organizar suas tarefas</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <CategoryManager 
          categories={categories}
          categoryColors={categoryColors}
          onAddCategory={onAddCategory}
          onRemoveCategory={onRemoveCategory}
          onUpdateCategoryColor={onUpdateCategoryColor}
        />
      </CardContent>
    </Card>
  );
}
