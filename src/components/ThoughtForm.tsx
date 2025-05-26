import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Thought } from '@/types/thought';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentDateTime } from '@/utils/date-time';
import { getTodaySaoPaulo } from '@/utils/time'; // ✅ Importado

interface ThoughtFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (thought: Thought) => void;
  editThought?: Thought | null;
}

export function ThoughtForm({ 
  isOpen, 
  onClose, 
  onSave, 
  editThought = null
}: ThoughtFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  
  useEffect(() => {
    if (editThought) {
      setTitle(editThought.title);
      setContent(editThought.content);
      setDate(editThought.date);
    } else {
      // ✅ Usa data de hoje no fuso de São Paulo
      const today = getTodaySaoPaulo();
      setTitle("");
      setContent("");
      setDate(today);
    }
  }, [editThought, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const thoughtData: Thought = {
      id: editThought?.id || uuidv4(),
      title,
      content,
      date,
      createdAt: editThought?.createdAt || getCurrentDateTime(),
    };
    
    onSave(thoughtData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-dark-gray border border-neon/30">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold neon-gradient-text">
            {editThought ? "Editar Pensamento" : "Novo Pensamento"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite um título para o pensamento"
              className="bg-medium-gray"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva seu pensamento..."
              className="bg-medium-gray min-h-[150px]"
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
              {editThought ? "Salvar Alterações" : "Salvar Pensamento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
