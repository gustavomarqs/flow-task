
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryBadge } from './CategoryBadge';
import { X, Plus } from 'lucide-react';
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
  onAddCategory: (category: string) => void;
  onRemoveCategory: (category: string) => void;
}

export function CategoryManager({ categories, onAddCategory, onRemoveCategory }: CategoryManagerProps) {
  const { toast } = useToast();
  const [newCategory, setNewCategory] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

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
    
    onAddCategory(newCategory.trim());
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

  return (
    <div className="space-y-4">
      {/* Adicionar nova categoria */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Nome da nova categoria"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={handleAddCategory}
          disabled={!newCategory.trim()}
          className="bg-neon text-deep-dark hover:bg-neon-glow flex items-center"
        >
          <Plus size={16} className="mr-1" /> Adicionar
        </Button>
      </div>

      {/* Lista de categorias */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Categorias existentes</h3>
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma categoria criada.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center bg-medium-gray rounded-lg px-3 py-1.5">
                <CategoryBadge category={category} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="ml-1 h-6 w-6 p-0 rounded-full text-red-500 hover:text-red-400 hover:bg-red-400/10"
                      onClick={() => handleDeleteCategory(category)}
                    >
                      <X size={14} />
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
