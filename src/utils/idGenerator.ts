import { randomBytes } from 'crypto';

// Use BigInt for counter to handle very large numbers safely
let counter = BigInt(0);
const MAX_COUNTER = BigInt(Number.MAX_SAFE_INTEGER);

/**
 * Generates a cryptographically strong unique ID
 * Format: timestamp-random-counter
 * Uses crypto.randomBytes for better randomness and BigInt for counter safety
 */
export const generateId = (prefix?: string): string => {
  // Atomic-like increment with overflow protection
  counter = counter + BigInt(1);
  if (counter > MAX_COUNTER) {
    counter = BigInt(0);
  }
  
  const timestamp = Date.now();
  // Use crypto.randomBytes for better randomness
  const random = randomBytes(4).toString('hex');
  const count = counter.toString().padStart(6, '0');
  
  // Include process.pid for additional uniqueness in clustered environments
  const pid = process.pid.toString(36);
  
  const id = `${timestamp}-${random}-${pid}-${count}`;
  return prefix ? `${prefix}_${id}` : id;
};

/**
 * Reset counter (useful for testing)
 */
export const resetIdCounter = (): void => {
  counter = BigInt(0);
};