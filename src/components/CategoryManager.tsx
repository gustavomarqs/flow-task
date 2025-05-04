
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryBadge } from './CategoryBadge';
import { X, Plus } from 'lucide-react';
import { ColorPicker } from './ColorPicker';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface CategoryManagerProps {
  categories: string[];
  categoryColors: Record<string, string>;
  onAddCategory: (category: string, color: string) => void;
  onRemoveCategory: (category: string) => void;
  onUpdateCategoryColor: (category: string, color: string) => void;
}

export function CategoryManager({ 
  categories, 
  categoryColors, 
  onAddCategory, 
  onRemoveCategory, 
  onUpdateCategoryColor 
}: CategoryManagerProps) {
  const { toast } = useToast();
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#06b6d4"); // Default cyan
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    
    if (categories.includes(newCategory.trim())) {
      toast({
        title: "Categoria já existe",
        description: `A categoria "${newCategory}" já existe na sua lista.`,
        variant: "destructive",
      });
      return;
    }
    
    onAddCategory(newCategory.trim(), newCategoryColor);
    setNewCategory("");
    toast({
      title: "Categoria adicionada",
      description: `A categoria "${newCategory}" foi adicionada com sucesso.`
    });
  };

  const handleDeleteCategory = (category: string) => {
    setCategoryToDelete(category);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      onRemoveCategory(categoryToDelete);
      toast({
        title: "Categoria removida",
        description: `A categoria "${categoryToDelete}" foi removida com sucesso.`,
      });
      setCategoryToDelete(null);
    }
  };

  const handleEditColor = (category: string) => {
    setEditingCategory(category);
  };

  const handleColorChange = (color: string) => {
    if (editingCategory) {
      onUpdateCategoryColor(editingCategory, color);
      toast({
        title: "Cor atualizada",
        description: `A cor da categoria "${editingCategory}" foi atualizada.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Adicionar nova categoria */}
      <div className="space-y-4 p-5 bg-zinc-800/50 rounded-lg">
        <h3 className="text-sm font-medium">Adicionar nova categoria</h3>
        <div className="space-y-3">
          <Input
            placeholder="Nome da nova categoria"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full bg-zinc-900"
          />
          
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Cor da categoria</label>
            <ColorPicker 
              selectedColor={newCategoryColor}
              onSelectColor={setNewCategoryColor}
            />
          </div>
          
          <Button 
            onClick={handleAddCategory}
            disabled={!newCategory.trim()}
            className="w-full bg-cyan-700 hover:bg-cyan-600 text-white transition-all duration-200 hover:scale-[1.02] mt-2"
          >
            <Plus size={16} className="mr-1" /> Adicionar Categoria
          </Button>
        </div>
      </div>

      {/* Lista de categorias */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Categorias existentes</h3>
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma categoria criada.</p>
        ) : (
          <div className="space-y-3">
            {categories.map((category) => (
              <div 
                key={category} 
                className="flex items-center justify-between bg-zinc-800/70 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: categoryColors[category] || '#06b6d4' }}
                  />
                  <span className="font-medium">{category}</span>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Edit color button */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => handleEditColor(category)}
                      >
                        Editar Cor
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Editar cor da categoria</AlertDialogTitle>
                        <AlertDialogDescription>
                          Escolha uma nova cor para a categoria "{category}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="py-4">
                        <ColorPicker 
                          selectedColor={categoryColors[category] || '#06b6d4'}
                          onSelectColor={handleColorChange}
                        />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setEditingCategory(null)}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => setEditingCategory(null)}>Salvar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  {/* Delete button */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="ml-1 h-8 text-red-500 hover:text-red-400 hover:bg-red-400/10"
                        onClick={() => handleDeleteCategory(category)}
                      >
                        <X size={16} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover categoria</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja remover a categoria "{category}"?
                          As tarefas associadas a esta categoria serão movidas para "Geral".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Confirmar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
