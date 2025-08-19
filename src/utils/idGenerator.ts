import { randomBytes } from 'crypto';

// Use BigInt for counter to handle very large numbers safely
let counter = BigInt(0);
const MAX_COUNTER = BigInt(Number.MAX_SAFE_INTEGER);

// Mutex-like lock for thread safety
let isUpdating = false;
const updateQueue: (() => void)[] = [];

/**
 * Thread-safe counter increment with overflow protection
 */
const incrementCounter = (): Promise<BigInt> => {
  return new Promise<BigInt>((resolve) => {
    const performIncrement = () => {
      const newValue = counter + BigInt(1);
      counter = newValue > MAX_COUNTER ? BigInt(0) : newValue;
      resolve(counter);
      
      // Process next in queue if any
      const next = updateQueue.shift();
      if (next) {
        process.nextTick(next);
      } else {
        isUpdating = false;
      }
    };

    if (!isUpdating) {
      isUpdating = true;
      process.nextTick(performIncrement);
    } else {
      updateQueue.push(performIncrement);
    }
  });
};

/**
 * Generates a cryptographically strong unique ID
 * Format: timestamp-random-counter
 * Uses crypto.randomBytes for better randomness and BigInt for counter safety
 */
export const generateId = async (prefix?: string): Promise<string> => {
  // Thread-safe counter increment
  const currentCount = await incrementCounter();
  
  const timestamp = Date.now();
  // Use crypto.randomBytes for better randomness
  const random = randomBytes(4).toString('hex');
  const count = currentCount.toString().padStart(6, '0');
  
  // Include process.pid for additional uniqueness in clustered environments
  const pid = process.pid.toString(36);
  
  const id = `${timestamp}-${random}-${pid}-${count}`;
  return prefix ? `${prefix}_${id}` : id;
};

/**
 * Synchronous version for backward compatibility
 * Note: This version uses timestamp + random for uniqueness without counter
 */
export const generateIdSync = (prefix?: string): string => {
  const timestamp = Date.now();
  const random = randomBytes(8).toString('hex'); // Extra bytes for uniqueness
  const pid = process.pid.toString(36);
  
  const id = `${timestamp}-${random}-${pid}`;
  return prefix ? `${prefix}_${id}` : id;
};

/**
 * Reset counter (useful for testing)
 */
export const resetIdCounter = (): void => {
  counter = BigInt(0);
};