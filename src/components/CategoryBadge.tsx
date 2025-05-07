
import React from 'react';

interface CategoryBadgeProps {
  category: string;
  color?: string;
}

export function CategoryBadge({ category, color }: CategoryBadgeProps) {
  // Ensure we have a valid color with fallback
  const badgeColor = color || '#06b6d4'; // Cyan default
  
  return (
    <div 
      className="px-2 py-1 text-xs font-medium rounded-full shadow-sm transition-transform hover:scale-105"
      style={{ 
        backgroundColor: `${badgeColor}30`, // 30% opacity version of the color
        color: badgeColor,
        border: `1px solid ${badgeColor}50` // 50% opacity border
      }}
    >
      {category}
    </div>
  );
}
