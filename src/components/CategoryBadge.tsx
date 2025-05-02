
import React from 'react';
import { Badge } from '@/components/ui/badge';

// Define possible category colors
const categoryColors: Record<string, string> = {
  'Treinos': 'bg-green-800 hover:bg-green-700 text-white border-green-700',
  'Estudos': 'bg-blue-800 hover:bg-blue-700 text-white border-blue-700',
  'default': 'bg-purple-800 hover:bg-purple-700 text-white border-purple-700',
};

interface CategoryBadgeProps {
  category: string;
  onClick?: () => void;
}

export function CategoryBadge({ category, onClick }: CategoryBadgeProps) {
  const colorClass = categoryColors[category] || categoryColors.default;
  
  return (
    <Badge 
      className={`${colorClass} cursor-pointer transition-colors`}
      onClick={onClick}
    >
      {category}
    </Badge>
  );
}
