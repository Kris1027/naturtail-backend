let counter = 0;

/**
 * Generates a unique ID using timestamp, random component, and counter
 * Format: timestamp-random-counter
 * This approach prevents collisions even in high-traffic scenarios
 */
export const generateId = (prefix?: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const count = (++counter).toString().padStart(4, '0');
  
  const id = `${timestamp}-${random}-${count}`;
  return prefix ? `${prefix}_${id}` : id;
};

/**
 * Reset counter (useful for testing)
 */
export const resetIdCounter = (): void => {
  counter = 0;
};