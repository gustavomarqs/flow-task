import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus } from 'lucide-react';

import { v4 as uuidv4 } from 'uuid';

import { Task } from '@/types/task';
import { RecurringTask } from '@/types/recurring-task';
import { CategoryBadge } from './CategoryBadge';

import { getCurrentDateTime } from '@/utils/date-time';
import { getTodayISODate } from '@/utils/date-time'; // ✅ função auxiliar segura

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (task: Task) => void;
  onSaveRecurringTask: (task: RecurringTask) => void;
  editTask?: Task | null;
  editRecurringTask?: RecurringTask | null;
  categories: string[];
  onAddCategory: (category: string) => void;
}

export function TaskForm({ 
  isOpen, 
  onClose, 
  onSaveTask,
  onSaveRecurringTask,
  editTask = null,
  editRecurringTask = null,
  categories,
  onAddCategory
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Geral");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);

  useEffect(() => {
    const today = getTodayISODate(); // ✅ data segura para input[type="date"]

    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description || "");
      setCategory(editTask.category);
      setDate(editTask.date || today);
      setTime(editTask.time || "");
      setIsRecurring(false);
    } else if (editRecurringTask) {
      setTitle(editRecurringTask.title);
      setDescription(editRecurringTask.description || "");
      setCategory(editRecurringTask.category);
      setIsRecurring(true);
      setDate(today);
      setTime("");
    } else {
      setTitle("");
      setDescription("");
      setCategory(categories.length > 0 ? categories[0] : "Geral");
      setDate(today);
      setTime("");
      setIsRecurring(false);
    }
  }, [editTask, editRecurringTask, isOpen, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalCategory = categories.includes(category) ? category : "Geral";

    if (isRecurring) {
      const taskData: RecurringTask = {
        id: editRecurringTask?.id || uuidv4(),
        title,
        description,
        category: finalCategory,
        active: editRecurringTask?.active !== undefined ? editRecurringTask.active : true,
        createdAt: editRecurringTask?.createdAt || getCurrentDateTime(),
      };

      onSaveRecurringTask(taskData);
    } else {
      const taskData: Task = {
        id: editTask?.id || uuidv4(),
        title,
        description,
        category: finalCategory,
        date,
        time,
        completed: editTask?.completed || false,
        createdAt: editTask?.createdAt || getCurrentDateTime(),
      };

      onSaveTask(taskData);
    }

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

  const isEditing = !!editTask || !!editRecurringTask;
  const availableCategories = categories.length > 0 ? categories : ["Geral"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-dark-gray border border-neon/30">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold neon-gradient-text">
            {isEditing ? "Editar Tarefa" : "Nova Tarefa"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((cat) => (
                <CategoryBadge
                  key={cat}
                  category={cat}
                  color=""
                  onClick={() => setCategory(cat)}
                  isActive={category === cat}
                />
              ))}
            </div>
            {showNewCategory ? (
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Nova categoria"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button type="button" onClick={handleAddCategory}>
                  Adicionar
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2 text-cyan-400 hover:text-cyan-300"
                onClick={() => setShowNewCategory(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Nova Categoria
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isRecurring">Tarefa Recorrente?</Label>
            <Switch
              id="isRecurring"
              checked={isRecurring}
              onCheckedChange={setIsRecurring}
            />
          </div>

          {!isRecurring && (
            <>
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Hora</Label>
                <Input
                  type="time"
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="flex justify-end pt-2">
            <Button type="submit">
              {isEditing ? "Salvar Alterações" : "Criar Tarefa"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
