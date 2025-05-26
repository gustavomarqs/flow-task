import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Achievement } from '@/types/achievement';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentDateTime } from '@/utils/date-time';
import { getTodaySaoPaulo } from '@/utils/time'; // ✅ Importação correta

interface AchievementFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (achievement: Achievement) => void;
  editAchievement?: Achievement | null;
}

export function AchievementForm({ 
  isOpen, 
  onClose, 
  onSave, 
  editAchievement = null
}: AchievementFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  
  useEffect(() => {
    if (editAchievement) {
      setTitle(editAchievement.title);
      setDescription(editAchievement.description || "");
      setDate(editAchievement.date);
    } else {
      const today = getTodaySaoPaulo(); // ✅ Correção aplicada aqui
      setTitle("");
      setDescription("");
      setDate(today);
    }
  }, [editAchievement, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const achievementData: Achievement = {
      id: editAchievement?.id || uuidv4(),
      title,
      description,
      date,
      createdAt: editAchievement?.createdAt || getCurrentDateTime(),
    };
    
    onSave(achievementData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-dark-gray border border-neon/30">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold neon-gradient-text">
            {editAchievement ? "Editar Façanha" : "Nova Façanha"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da façanha"
              className="bg-medium-gray"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva sua façanha"
              className="bg-medium-gray"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-medium-gray"
              required
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-neon text-deep-dark hover:bg-neon-glow"
            >
              {editAchievement ? "Salvar Alterações" : "Registrar Façanha"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
