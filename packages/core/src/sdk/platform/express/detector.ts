/**
 * Express App Detector Module
 * 
 * This module provides simplified detection of Express applications.
 * It consolidates the auto-detection logic into a cleaner implementation
 * while maintaining compatibility with the previous approach.
 */
import { Express, ExpressDetectionResult } from '../../types';
import { ExpressRegistry } from './registry';

/**
 * Check if an object is an Express app
 * 
 * @param obj Object to check
 * @returns True if the object is an Express app, false otherwise
 */
export function isExpressApp(obj: any): boolean {
  return obj && 
         typeof obj === 'function' && 
         typeof obj.use === 'function' && 
         typeof obj.listen === 'function';
}

/**
 * Basic detection of Express app from Node.js require cache
 * A simplified version of the previous complex detection logic
 * 
 * @returns Express app if found, null otherwise
 */
export function findExpressAppInRequireCache(): Express | null {
  try {
    // This is a simplified version - in the real implementation,
    // we would scan the require cache more thoroughly
    if (require && require.cache) {
      const cacheValues = Object.values(require.cache);
      
      // Look for Express app in exports
      for (const module of cacheValues) {
        if (module && module.exports) {
          // Check direct export
          if (isExpressApp(module.exports)) {
            return module.exports;
          }
          
          // Check properties of exports if it's an object
          if (typeof module.exports === 'object') {
            for (const key in module.exports) {
              const value = module.exports[key];
              if (isExpressApp(value)) {
                return value;
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.warn('Error searching require cache for Express app:', error);
  }
  
  return null;
}

/**
 * Detect Express app using a simplified approach
 * 
 * @returns Detection result with the app and source
 */
export function detectExpressApp(): ExpressDetectionResult {
  const timestamp = Date.now();
  let app: Express | null = null;
  let source: ExpressDetectionResult['source'] = 'none';
  
  // First check the registry (highest priority)
  app = ExpressRegistry.get();
  if (app) {
    source = 'registry';
    return { app, source, timestamp };
  }
  
  // Then check global state (for backward compatibility)
  app = ExpressRegistry.checkGlobalState();
  if (app) {
    source = 'global';
    return { app, source, timestamp };
  }
  
  // Finally try auto-detection
  app = findExpressAppInRequireCache();
  if (app) {
    // Register the detected app for future use
    ExpressRegistry.register(app);
    source = 'auto-detection';
    return { app, source, timestamp };
  }
  
  // Return null if no app found
  return { app: null, source: 'none', timestamp };
}

/**
 * Register an Express app for future detection
 * 
 * @param app Express app to register
 * @returns The registered app
 */
export function registerExpressApp(app: Express): Express {
  if (!isExpressApp(app)) {
    throw new Error('Invalid Express app provided for registration');
  }
  
  return ExpressRegistry.register(app);
} 