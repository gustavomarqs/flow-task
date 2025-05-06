
/**
 * Utility functions for handling date and time consistently across the application
 */

/**
 * Gets the current date and time in ISO format
 * This ensures we always have consistent date/time recording
 */
export function getCurrentDateTime(): string {
  return new Date().toISOString();
}

/**
 * Gets the current date in YYYY-MM-DD format
 */
export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Format a date for display in the UI
 */
export function formatDisplayDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
    return date.toTimeString().substring(0, 5); // Get HH:MM
  } catch (error) {
    console.error('Error getting time from date string:', error);
    return '';
  }
}
