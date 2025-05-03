
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string; // Added description as optional prop
  action?: () => void;
  actionLabel?: string;
  showAddButton?: boolean;
}

export function PageHeader({ 
  title, 
  description,
  action, 
  actionLabel = "Adicionar", 
  showAddButton = true 
}: PageHeaderProps) {
  const { toast } = useToast();
  
  const handleAction = () => {
    if (action) {
      action();
    } else {
      toast({
        title: "Ação não implementada",
        description: "Esta funcionalidade será adicionada em breve.",
      });
    }
  };

  return (
    <div className="space-y-2 mb-6">
      <h1 className="text-2xl font-bold neon-gradient-text">{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
      <div className="flex justify-between items-center">
        <div></div>
        {showAddButton && (
          <Button
            onClick={handleAction}
            className="bg-neon text-deep-dark hover:bg-neon-glow transition-all duration-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
