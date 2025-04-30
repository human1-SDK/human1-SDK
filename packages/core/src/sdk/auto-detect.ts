/**
 * Express App Auto-Detection Module
 * 
 * This module provides automatic detection of Express applications.
 * It searches for Express app instances in various JavaScript runtime contexts
 * to enable seamless SDK integration without requiring explicit app configuration.
 * 
 * The auto-detection uses a sophisticated multi-step approach and scoring system
 * to find and select the most likely Express app instance.
 */
import { Express } from 'express';

/**
 * Map to track when Express apps were created
 * Used for preferring more recently created apps when multiple are found
 */
const expressAppCreationTimes = new WeakMap<Express, number>();

/**
 * Tries to auto-detect an Express app from the global scope or require cache
 * 
 * The auto-detection process follows these steps:
 * 1. Check for a previously detected app in global context
 * 2. Search the main module's exports
 * 3. Analyze the call context to find the caller module
 * 4. Look in the global object for Express app references
 * 5. Check other user modules as a fallback
 * 
 * For each candidate app, a score is calculated based on:
 * - Source (main module has higher priority than other modules)
 * - Context (app/server named variables get higher priority)
 * - Creation time (more recent apps are preferred)
 * 
 * @returns Express app instance or null if not found
 */
export function autoDetectExpressApp(): Express | null {
  try {
    const globalObj = global as any;

    /**
     * Step 1: Check previously detected apps
     * 
     * First look for globally cached Express app instances that were
     * previously detected or explicitly set.
     */
    // First check if we have previously detected an app and stored it
    if (globalObj.__h1_sdk_detected_app && 
        typeof globalObj.__h1_sdk_detected_app.use === 'function' && 
        typeof globalObj.__h1_sdk_detected_app.listen === 'function') {
      console.log('Human1 SDK: Using previously detected Express app');
      return globalObj.__h1_sdk_detected_app;
    }
    
    // Check the special global property (legacy support)
    if (globalObj.__h1_express_app && 
        typeof globalObj.__h1_express_app.use === 'function' && 
        typeof globalObj.__h1_express_app.listen === 'function') {
      console.log('Human1 SDK: Express app found in global.__h1_express_app');
      
      // Store directly in a globally accessible location for easier access
      if (!globalObj.__h1_sdk_detected_app) {
        globalObj.__h1_sdk_detected_app = globalObj.__h1_express_app;
      }
      
      return globalObj.__h1_express_app;
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
    const isExpressApp = (obj: any): boolean => {
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
    const trackApp = (app: Express) => {
      if (!expressAppCreationTimes.has(app)) {
        expressAppCreationTimes.set(app, Date.now());
      }
      return app;
    };
    
    /**
     * Map to track discovery information for each candidate app
     * 
     * This records where each app was found and its score for ranking:
     * - source: Where the app was found (module, global, etc.)
     * - context: Specific location (exports, property name, etc.)
     * - score: Numeric score for ranking candidates (higher is better)
     */
    const appDiscoveryContext = new Map<Express, {
      source: string;
      context: string;
      score: number;
    }>();
    
    // Array to collect all the candidate Express apps we find
    const appCandidates: Express[] = [];
    
    /**
     * Step 2: Check the main module's exports
     * 
     * The main module (entry point) is the most likely place to find
     * the primary Express app for the application.
     */
    try {
      const mainModule = require.main;
      if (mainModule && mainModule.exports) {
        if (isExpressApp(mainModule.exports)) {
          const app = trackApp(mainModule.exports);
          appCandidates.push(app);
          appDiscoveryContext.set(app, {
            source: 'main_module',
            context: 'exports',
            score: 100  // highest priority
          });
        } else if (typeof mainModule.exports === 'object') {
          // Check for app property or other common patterns
          const keys = Object.keys(mainModule.exports);
          for (const key of keys) {
            const value = mainModule.exports[key];
            if (isExpressApp(value)) {
              const app = trackApp(value);
              appCandidates.push(app);
              let score = 90;
              // Boost score for common app property names
              if (key === 'app' || key === 'application' || key === 'server') {
                score += 5;
              }
              appDiscoveryContext.set(app, {
                source: 'main_module',
                context: `exports.${key}`,
                score: score
              });
            }
          }
        }
      }
    } catch (err) {
      // Skip errors in main module detection
    }
    
    /**
     * Step 3: Check the current call context
     * 
     * Analyze the stack trace to find the module that called the SDK.
     * This module is likely to contain the Express app we need.
     */
    try {
      const originalPrepareStackTrace = Error.prepareStackTrace;
      Error.prepareStackTrace = (_, stack) => stack;
      
      const stack = new Error().stack as unknown as NodeJS.CallSite[];
      Error.prepareStackTrace = originalPrepareStackTrace;
      
      // Look for our caller module
      const relevantFrames = stack
        .map(frame => {
          const filename = frame.getFileName();
          if (!filename) return null;
          if (filename.includes('node_modules') || 
              filename.includes('internal/') || 
              filename.includes('sdk/auto-detect')) {
            return null;
          }
          return {
            filename,
            line: frame.getLineNumber(),
            column: frame.getColumnNumber()
          };
        })
        .filter(Boolean);
      
      if (relevantFrames.length > 0) {
        // The first relevant frame is likely where the SDK is being initialized
        // Get the module from the require cache
        const callerModule = Object.values(require.cache || {})
          .find(m => m && m.filename === relevantFrames[0]?.filename);
        
        if (callerModule) {
          // This is the module calling us - it's likely to have the Express app
          if (isExpressApp(callerModule.exports)) {
            const app = trackApp(callerModule.exports);
            appCandidates.push(app);
            appDiscoveryContext.set(app, {
              source: 'caller_module',
              context: 'exports',
              score: 95
            });
          } else if (typeof callerModule.exports === 'object') {
            // Check its exports
            for (const key in callerModule.exports) {
              try {
                const value = callerModule.exports[key];
                if (isExpressApp(value)) {
                  const app = trackApp(value);
                  appCandidates.push(app);
                  let score = 90;
                  if (key === 'app' || key === 'application' || key === 'server') {
                    score += 5;
                  }
                  appDiscoveryContext.set(app, {
                    source: 'caller_module',
                    context: `exports.${key}`,
                    score: score
                  });
                }
              } catch {}
            }
          }
          
          // Also check module-level variables that might hold the app
          // This is a heuristic approach to find variables in the module's scope
          try {
            const moduleVars = Object.getOwnPropertyNames(callerModule);
            for (const varName of moduleVars) {
              try {
                const value = (callerModule as any)[varName];
                if (isExpressApp(value)) {
                  const app = trackApp(value);
                  appCandidates.push(app);
                  let score = 85;
                  if (varName === 'app' || varName === 'application' || varName === 'server') {
                    score += 5;
                  }
                  appDiscoveryContext.set(app, {
                    source: 'caller_module',
                    context: `var.${varName}`,
                    score: score
                  });
                }
              } catch {}
            }
          } catch {}
        }
      }
    } catch (callStackError) {
      // Skip errors in call stack analysis
    }
    
    /**
     * Step 4: Check globals for Express app references
     * 
     * Look for Express app instances stored in the global scope.
     */
    for (const key in globalObj) {
      try {
        // Skip functions and system objects that will cause errors
        if (typeof globalObj[key] === 'function' || key.startsWith('_') || key === 'global') {
          continue;
        }
        
        const value = globalObj[key];
        if (isExpressApp(value)) {
          const app = trackApp(value);
          appCandidates.push(app);
          let score = 80;
          if (key === 'app' || key === 'expressApp' || key === 'application') {
            score += 10;
          }
          appDiscoveryContext.set(app, {
            source: 'global',
            context: key,
            score: score
          });
        }
      } catch {}
    }
    
    /**
     * Step 5: Check other user modules as a fallback
     * 
     * If we haven't found an app yet, check all other user modules
     * in the require cache as a last resort.
     */
    const cache = require.cache || {};
    for (const id in cache) {
      try {
        if (id.includes('node_modules')) continue;
        
        const mod = cache[id];
        if (!mod || !mod.exports) continue;
        
        // Check module exports
        if (isExpressApp(mod.exports)) {
          const app = trackApp(mod.exports);
          // Only add if we haven't seen this app yet
          if (!appCandidates.includes(app)) {
            appCandidates.push(app);
            appDiscoveryContext.set(app, {
              source: 'other_module',
              context: 'exports',
              score: 60
            });
          }
        } else if (typeof mod.exports === 'object') {
          // Check exports properties
          for (const key in mod.exports) {
            try {
              const value = mod.exports[key];
              if (isExpressApp(value)) {
                const app = trackApp(value);
                // Only add if we haven't seen this app yet
                if (!appCandidates.includes(app)) {
                  appCandidates.push(app);
                  let score = 50;
                  if (key === 'app' || key === 'application' || key === 'server') {
                    score += 5;
                  }
                  appDiscoveryContext.set(app, {
                    source: 'other_module',
                    context: `exports.${key}`,
                    score: score
                  });
                }
              }
            } catch {}
          }
        }
      } catch {}
    }
    
    /**
     * Final Step: Select the best candidate
     * 
     * If we found any Express app candidates, choose the one with the highest
     * score and/or most recent creation time.
     */
    if (appCandidates.length > 0) {
      console.log(`Human1 SDK: Found ${appCandidates.length} Express app candidates`);
      
      // Sort candidates by score, then by creation time (most recent first)
      appCandidates.sort((a, b) => {
        const scoreA = appDiscoveryContext.get(a)?.score || 0;
        const scoreB = appDiscoveryContext.get(b)?.score || 0;
        
        // First compare by score
        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }
        
        // If scores are equal, compare by creation time (more recent is better)
        const timeA = expressAppCreationTimes.get(a) || 0;
        const timeB = expressAppCreationTimes.get(b) || 0;
        return timeB - timeA;
      });
      
      // Select the best candidate
      const selectedApp = appCandidates[0];
      const context = appDiscoveryContext.get(selectedApp);
      
      console.log(`Human1 SDK: Selected Express app from ${context?.source} (${context?.context})`);
      
      // Store the detected app globally for future reference
      if (!globalObj.__h1_sdk_detected_app) {
        globalObj.__h1_sdk_detected_app = selectedApp;
      }
      
      return selectedApp;
    }
    
    return null;
  } catch (error) {
    console.log('Human1 SDK: Error during auto-detection', error);
    return null;
  }
} 