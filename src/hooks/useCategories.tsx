
import { useState, useEffect } from 'react';
import { getFromStorage, saveToStorage, getCategoryColors } from '@/utils/storage';
import { useAuth } from '@/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryColors, setCategoryColors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Load categories from Supabase
  useEffect(() => {
    async function fetchCategories() {
      if (!user) return;
      
      setLoading(true);
      try {
        // Get categories from Supabase where user_id matches
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          // Extract category names
          const categoryNames = data.map(cat => cat.name);
          setCategories(categoryNames);
          
          // Create a color map from the data
          const colorMap: Record<string, string> = {};
          data.forEach(cat => {
            colorMap[cat.name] = cat.color;
          });
          setCategoryColors(colorMap);
          
          // Also save to localStorage as fallback
          saveToStorage(`categories_${user.id}`, categoryNames);
          saveToStorage(`categoryColors_${user.id}`, colorMap);
        } else {
          // If no categories found, use defaults
          const defaultCategories = ["Treinos", "Estudos"];
          setCategories(defaultCategories);
          
          // Create these default categories in Supabase
          const colors = getCategoryColors(defaultCategories);
          setCategoryColors(colors);
          
          // Save default categories to Supabase
          await Promise.all(defaultCategories.map(async (catName, index) => {
            await supabase.from('categories').insert({
              name: catName,
              color: colors[catName],
              user_id: user.id
            });
          }));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        
        // Fallback to localStorage if Supabase fails
        const savedCategories = getFromStorage(`categories_${user.id}`, ["Treinos", "Estudos"]);
        const savedColors = getFromStorage(`categoryColors_${user.id}`, {});
        
        setCategories(savedCategories);
        setCategoryColors(savedColors);
        
        toast({
          title: "Erro ao carregar categorias",
          description: "Não foi possível carregar suas categorias do servidor.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchCategories();
  }, [user?.id, toast]);
  
  // Add a new category
  const handleAddCategory = async (category: string) => {
    if (!user || categories.includes(category)) return;
    
    try {
      // Generate a color for the new category
      const newColors = getCategoryColors([...categories, category]);
      const categoryColor = newColors[category];
      
      // Save to Supabase
      const { error } = await supabase
        .from('categories')
        .insert({
          name: category,
          color: categoryColor,
          user_id: user.id
        });
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setCategories(prevCategories => [...prevCategories, category]);
      setCategoryColors(prev => ({
        ...prev,
        [category]: categoryColor
      }));
      
      // Update localStorage backup
      saveToStorage(`categories_${user.id}`, [...categories, category]);
      saveToStorage(`categoryColors_${user.id}`, {
        ...categoryColors,
        [category]: categoryColor
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Erro ao adicionar categoria",
        description: "Não foi possível salvar a categoria no servidor.",
        variant: "destructive"
      });
    }
  };
  
  return {
    categories,
    categoryColors,
    loading,
    handleAddCategory
  };
}
