
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { ThoughtCard } from '@/components/ThoughtCard';
import { ThoughtForm } from '@/components/ThoughtForm';
import { Input } from '@/components/ui/input';
import { Thought } from '@/types/thought';

export default function ThoughtsPage() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingThought, setEditingThought] = useState<Thought | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load thoughts from localStorage
    const savedThoughts = localStorage.getItem('thoughts');
    if (savedThoughts) {
      setThoughts(JSON.parse(savedThoughts));
    }
  }, []);

  useEffect(() => {
    // Save thoughts to localStorage
    localStorage.setItem('thoughts', JSON.stringify(thoughts));
  }, [thoughts]);

  const handleAddThought = () => {
    setEditingThought(null);
    setIsFormOpen(true);
  };

  const handleEditThought = (thought: Thought) => {
    setEditingThought(thought);
    setIsFormOpen(true);
  };

  const handleSaveThought = (thought: Thought) => {
    if (editingThought) {
      setThoughts(thoughts.map(t => t.id === thought.id ? thought : t));
    } else {
      setThoughts([...thoughts, thought]);
    }
    setIsFormOpen(false);
    setEditingThought(null);
  };

  const handleDeleteThought = (id: string) => {
    setThoughts(thoughts.filter(thought => thought.id !== id));
  };

  // Filter and sort thoughts
  const filteredThoughts = thoughts
    .filter(thought => {
      return (
        thought.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thought.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      // Sort by date (newest first)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Meus Pensamentos"
        action={handleAddThought}
        actionLabel="Novo Pensamento"
      />
      
      <div className="mb-6">
        <Input
          placeholder="Pesquisar pensamentos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-medium-gray"
        />
      </div>
      
      {filteredThoughts.length > 0 ? (
        <div>
          {filteredThoughts.map((thought) => (
            <ThoughtCard
              key={thought.id}
              thought={thought}
              onEdit={handleEditThought}
              onDelete={handleDeleteThought}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-gray-700 rounded-lg">
          <p className="text-gray-400">
            {searchQuery 
              ? "Nenhum pensamento encontrado para sua pesquisa." 
              : "Nenhum pensamento registrado ainda. Comece registrando uma nova reflexão!"}
          </p>
        </div>
      )}
      
      <ThoughtForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveThought}
        editThought={editingThought}
      />
    </div>
  );
}
