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

/**
 * Get today's date in São Paulo timezone as yyyy-MM-dd
 * Use this for saving the 'date' field in forms
 */
export function getTodaySaoPaulo(): string {
  const now = new Date();
  const saoPauloOffset = -3 * 60; // São Paulo UTC-3 in minutes
  const local = new Date(now.getTime() + (now.getTimezoneOffset() + saoPauloOffset) * 60000);
  return local.toISOString().split('T')[0]; // yyyy-MM-dd
}
