
import React from 'react';

interface CategoryFiltersProps {
  categories: string[];
  activeTab: string;
  onCategoryClick: (category: string) => void;
}

export function CategoryFilters({ categories, activeTab, onCategoryClick }: CategoryFiltersProps) {
  return (
    <div className="mt-2 flex flex-wrap gap-2 mb-4">
      {categories.map(category => (
        <button 
          key={category}
          className={`px-3 py-1.5 text-sm rounded-md shadow-sm transition-all duration-200 hover:scale-105 ${
            activeTab === `category-${category}` 
              ? 'bg-cyan-600 text-white' 
              : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
          }`}
          onClick={() => onCategoryClick(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
