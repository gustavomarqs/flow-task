
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { v4 as uuidv4 } from 'uuid';
import { CategoryBadge } from './CategoryBadge';
import { RecurringTask } from '@/types/recurring-task';

interface RecurringTaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: RecurringTask) => void;
  editTask?: RecurringTask | null;
  categories: string[];
  onAddCategory: (category: string) => void;
}

export function RecurringTaskForm({ 
  isOpen, 
  onClose, 
  onSave, 
  editTask = null,
  categories,
  onAddCategory
}: RecurringTaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Treinos");
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description || "");
      setCategory(editTask.category);
    } else {
      setTitle("");
      setDescription("");
      setCategory("Treinos");
    }
  }, [editTask, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData: RecurringTask = {
      id: editTask?.id || uuidv4(),
      title,
      description,
      category,
      active: editTask?.active !== undefined ? editTask.active : true,
      createdAt: editTask?.createdAt || new Date().toISOString(),
    };
    
    onSave(taskData);
    onClose();
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setCategory(newCategory.trim());
      setNewCategory("");
      setShowNewCategory(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-dark-gray border border-neon/30">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold neon-gradient-text">
            {editTask ? "Editar Tarefa Recorrente" : "Nova Tarefa Recorrente"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da tarefa recorrente"
              className="bg-medium-gray"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite uma descrição para a tarefa"
              className="bg-medium-gray"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Categoria</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {categories.map((cat) => (
                <div 
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`cursor-pointer transition-all ${category === cat ? 'scale-110' : 'opacity-70'}`}
                >
                  <CategoryBadge category={cat} />
                </div>
              ))}
              {!showNewCategory && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowNewCategory(true)}
                >
                  + Nova Categoria
                </Button>
              )}
            </div>
            
            {showNewCategory && (
              <div className="flex items-center gap-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Nome da nova categoria"
                  className="bg-medium-gray"
                />
                <Button 
                  type="button" 
                  onClick={handleAddCategory}
                  disabled={!newCategory.trim()}
                >
                  Adicionar
                </Button>
                <Button 
                  type="button" 
                  variant="ghost"
                  onClick={() => {
                    setShowNewCategory(false);
                    setNewCategory("");
                  }}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-neon text-deep-dark hover:bg-neon-glow"
            >
              {editTask ? "Salvar Alterações" : "Criar Tarefa Recorrente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
