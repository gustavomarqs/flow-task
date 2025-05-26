import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Task } from '@/types/task';
import { RecurringTask } from '@/types/recurring-task';
import { v4 as uuidv4 } from 'uuid';
import { CategoryBadge } from './CategoryBadge';
import { Switch } from "@/components/ui/switch";
import { Plus } from 'lucide-react';
import { getCurrentDateTime } from '@/utils/date-time';
import { formatDateInSaoPaulo } from '@/utils/time'; // ✅ Importação adicionada

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
  const [category, setCategory] = useState("Treinos");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  
  useEffect(() => {
    const today = formatDateInSaoPaulo(new Date(), 'yyyy-MM-dd'); // ✅ Padronizado

    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description || "");
      setCategory(editTask.category);
      setDate(editTask.date);
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
          {/* Campos: título, descrição, categoria, recorrente, data/hora */}
          {/* ... (sem alterações visuais aqui) */}
        </form>
      </DialogContent>
    </Dialog>
  );
}
