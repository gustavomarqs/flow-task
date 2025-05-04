
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
