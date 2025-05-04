
/**
 * Formata uma data no padrão brasileiro
 */
export function formatDateBR(date: Date | string): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Formata um número para o padrão brasileiro
 */
export function formatNumberBR(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

/**
 * Trunca um texto para um tamanho específico
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
