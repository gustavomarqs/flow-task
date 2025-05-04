
import React from 'react';
import { Badge } from '@/components/ui/badge';

// Define possible category colors
const categoryColors: Record<string, string> = {
  'Treinos': 'bg-cyan-800 hover:bg-cyan-700 text-white border-cyan-700',
  'Estudos': 'bg-blue-800 hover:bg-blue-700 text-white border-blue-700',
  'Geral': 'bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700',
  'default': 'bg-indigo-800 hover:bg-indigo-700 text-white border-indigo-700',
};

interface CategoryBadgeProps {
  category: string;
  onClick?: () => void;
}

export function CategoryBadge({ category, onClick }: CategoryBadgeProps) {
  const colorClass = categoryColors[category] || categoryColors.default;
  
  return (
    <Badge 
      className={`${colorClass} cursor-pointer transition-all duration-200 hover:scale-105`}
      onClick={onClick}
    >
      {category}
    </Badge>
  );
}
