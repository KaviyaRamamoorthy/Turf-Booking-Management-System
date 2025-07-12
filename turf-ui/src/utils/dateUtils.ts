/**
 * Utility functions for handling dates in the application
 * Since Redux state stores dates as ISO strings, these utilities help with conversion
 */

/**
 * Convert a Date object to ISO string
 */
export const toISOString = (date: Date): string => {
  return date.toISOString();
};

/**
 * Convert an ISO string to Date object
 */
export const fromISOString = (isoString: string): Date => {
  return new Date(isoString);
};

/**
 * Format a date string for display
 */
export const formatDate = (dateString: string, options?: Intl.DateTimeFormatOptions): string => {
  const date = fromISOString(dateString);
  return date.toLocaleDateString('en-US', options);
};

/**
 * Format a date string for display with time
 */
export const formatDateTime = (dateString: string): string => {
  const date = fromISOString(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get current date as ISO string
 */
export const getCurrentDateISO = (): string => {
  return new Date().toISOString();
};

/**
 * Check if a string is a valid ISO date string
 */
export const isValidISOString = (str: string): boolean => {
  const date = new Date(str);
  return !isNaN(date.getTime());
}; 