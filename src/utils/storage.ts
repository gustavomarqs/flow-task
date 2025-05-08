/**
 * Salva um valor no localStorage
 */
export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Erro ao salvar ${key} no localStorage:`, error);
  }
}

/**
 * Obtém um valor do localStorage
 */
export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Erro ao obter ${key} do localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Remove um valor do localStorage
 */
export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Erro ao remover ${key} do localStorage:`, error);
  }
}

/**
 * Limpa todo o localStorage
 */
export function clearStorage(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Erro ao limpar localStorage:', error);
  }
}

/**
 * Obtém cores das categorias ou retorna valores padrão
 * This now respects provided categoryColors first
 */
export function getCategoryColors(categories: string[], existingColors: Record<string, string> = {}): Record<string, string> {
  const defaultColors = [
    '#06b6d4', // cyan
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
  ];
  
  const result: Record<string, string> = {};
  
  // Set a color for each category
  categories.forEach((category, index) => {
    // First check if there's already a color for this category in existingColors
    if (existingColors && existingColors[category]) {
      result[category] = existingColors[category];
      return;
    }
    
    // Otherwise use localStorage
    const savedColors = getFromStorage<Record<string, string>>('categoryColors', {});
    if (savedColors[category]) {
      result[category] = savedColors[category];
      return;
    }
    
    // As a final fallback, use default colors
    result[category] = defaultColors[index % defaultColors.length];
  });
  
  return result;
}
