
import { useState, useEffect } from 'react';
import { getFromStorage, saveToStorage, getCategoryColors } from '@/utils/storage';
import { useAuth } from '@/auth/AuthProvider';

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryColors, setCategoryColors] = useState<Record<string, string>>({});
  const { user } = useAuth();
  
  // Load categories from localStorage
  useEffect(() => {
    if (user) {
      const savedCategories = getFromStorage(`categories_${user.id}`, ["Treinos", "Estudos"]);
      if (savedCategories.length > 0) {
        setCategories(savedCategories);
        
        // Load category colors
        const colors = getCategoryColors(savedCategories);
        setCategoryColors(colors);
      }
    }
  }, [user?.id]);
  
  // Update and save categories
  useEffect(() => {
    if (user) {
      // Update category colors when categories change
      const colors = getCategoryColors(categories);
      setCategoryColors(colors);
      
      // Save categories
      saveToStorage(`categories_${user.id}`, categories);
    }
  }, [categories, user?.id]);
  
  // Add a new category
  const handleAddCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories(prevCategories => [...prevCategories, category]);
    }
  };
  
  return {
    categories,
    categoryColors,
    handleAddCategory
  };
}
