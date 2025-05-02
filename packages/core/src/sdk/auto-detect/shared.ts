/**
 * Shared state and utilities for auto-detection
 * 
 * This module provides shared state and utility functions
 * used across the auto-detection system.
 */
import { Express } from 'express';

/**
 * Map to track when Express apps were created
 * Used for preferring more recently created apps when multiple are found
 */
export const expressAppCreationTimes = new WeakMap<Express, number>();

/**
 * Keep track of recently created Express apps globally
 * This array will store recently created Express instances to improve auto-detection
 */
export const recentExpressInstances: Express[] = [];

/**
 * Global Express app reference for immediate access
 * This must be reliably available before SDK initialization
 */
// Set up a global reference to track the Express app
export const globalObj = global as any;
if (!globalObj.__h1_global_contexts) {
  globalObj.__h1_global_contexts = {
    expressApp: null,
    expressAppTimestamp: 0,
    sdkInstance: null
  };
}

/**
 * Helper function to check if an object looks like an Express app
 * 
 * Tests if an object has the essential methods of an Express app:
 * - use(): for mounting middleware
 * - listen(): for starting the server
 * - get() or post(): for at least one HTTP method handler
 * 
 * @param obj Object to test
 * @returns True if the object appears to be an Express app
 */
export const isExpressApp = (obj: any): boolean => {
  try {
    const result = obj && 
            typeof obj === 'object' && 
            typeof obj.use === 'function' && 
            typeof obj.listen === 'function' &&
            (typeof obj.get === 'function' || typeof obj.post === 'function');
    return result;
  } catch (err) {
    return false;
  }
};

/**
 * Helper function to track when an Express app was discovered
 * 
 * Records the timestamp of when each app was found for later sorting
 * 
 * @param app The Express app to track
 * @returns The same app for chaining
 */
export const trackApp = (app: Express) => {
  if (!expressAppCreationTimes.has(app)) {
    expressAppCreationTimes.set(app, Date.now());
  }
  return app;
}; 