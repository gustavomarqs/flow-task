/**
 * Utility functions for handling date and time consistently across the application
 */
import { getTimestampInSaoPaulo } from './time';

/**
 * Gets the current date and time in ISO format
 * This ensures we always have consistent date/time recording
 */
export function getCurrentDateTime(): string {
  // Use the São Paulo timezone function instead of basic ISO
  return getTimestampInSaoPaulo();
}

/**
 * Gets the current date in YYYY-MM-DD format
 * Uses the local timezone (not UTC) to avoid day discrepancies
 */
export function getCurrentDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format a date for display in the UI
 */
export function formatDisplayDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    // Using Brazilian locale to format dates properly
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'America/Sao_Paulo', // Using Sao Paulo timezone for Brazilian users
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Format a date and time for display in the UI
 */
export function formatDisplayDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    // Using Brazilian locale to format dates properly with time
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo', // Using Sao Paulo timezone for Brazilian users
    }).format(date);
  } catch (error) {
    console.error('Error formatting date and time:', error);
    return dateString;
  }
}

/**
 * Parse a date string to ensure it's valid
 * Returns the ISO string if valid, or the current datetime if not
 */
export function ensureValidDate(dateString: string | undefined): string {
  if (!dateString) return getCurrentDateTime();
  
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) throw new Error('Invalid date');
    return date.toISOString();
  } catch (error) {
    console.error('Invalid date provided, using current date:', error);
    return getCurrentDateTime();
  }
}

/**
 * Safely get the time component from a date-time string
 */
export function getTimeFromDateTime(dateTimeString: string): string {
  try {
    const date = new Date(dateTimeString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error('Error getting time from date string:', error);
    return '';
  }
}

/**
 * Get local date object from ISO string
 * This helps with timezone issues when working with dates
 */
export function getLocalDateFromISO(dateString: string): Date {
  const date = new Date(dateString);
  return date;
}

export function getTodayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

