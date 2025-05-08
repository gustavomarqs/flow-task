
import { format, formatInTimeZone } from 'date-fns-tz';

/**
 * Get current timestamp in São Paulo timezone in ISO format
 */
export function getTimestampInSaoPaulo(): string {
  const saoPauloTimeZone = 'America/Sao_Paulo';
  const now = new Date();

  // Format ISO with timezone (ex: 2025-05-08T14:35:00-03:00)
  return formatInTimeZone(now, saoPauloTimeZone, "yyyy-MM-dd'T'HH:mm:ssXXX");
}

/**
 * Format a date for display in São Paulo timezone
 */
export function formatDateInSaoPaulo(dateString: string, formatStr: string = "dd/MM/yyyy HH:mm"): string {
  const saoPauloTimeZone = 'America/Sao_Paulo';
  const date = new Date(dateString);
  return formatInTimeZone(date, saoPauloTimeZone, formatStr);
}
