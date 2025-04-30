import { Express } from 'express';
import { Human1 } from './human1-class';
import { CallableSDK } from './callable-sdk';
import { makeCallable } from './callable-helper';
import { autoDetectExpressApp } from './auto-detect';
import { ServerResult } from '../server';

/**
 * Global tracking for Express app instances
 * 
 * These variables help maintain state across multiple SDK instances:
 * - lastDetectedExpressApp: Caches the most recently detected Express app
 * - lastExpressMap: Maps Human1 instances to their assigned Express apps
 */
// Keep track of the last express app detected for sharing
let lastDetectedExpressApp: Express | null = null;
let lastExpressMap = new WeakMap<Human1, Express>();

/**
 * Creates a new Human1 SDK instance
 * 
 * This factory function creates a callable Human1 SDK instance that can be:
 * 1. Called as a function: sdk()
 * 2. Used as an object with methods: sdk.use(), sdk.express()
 * 
 * The SDK initializes with Express auto-detection if no app is provided,
 * and automatically handles environment loading and server initialization.
 * 
 * @returns A callable Human1 instance with all methods and properties
 */
export function createSDK(): CallableSDK {
  const instance = new Human1();
  
  /**
   * Core initializer function that becomes the callable SDK
   * 
   * This function handles the various initialization scenarios:
   * - When called with Express app: Explicitly uses that app
   * - When called with options: Applies those options
   * - When called with no args: Attempts auto-detection of Express
   * 
   * @param appOrOptions Express app instance or configuration options
   * @returns Server initialization result
   */
  // Create a callable function that handles everything in one call
  const initializerFn = (appOrOptions?: any): ServerResult => {
    let options = {};
    
    // Check if first argument is an Express app
    if (appOrOptions && typeof appOrOptions.use === 'function' && typeof appOrOptions.listen === 'function') {
      // Connect to Express - this is the most reliable approach
      const expressApp: Express = appOrOptions;
      // Store the app for this instance and also make it globally available
      instance.express(expressApp);
      lastDetectedExpressApp = expressApp;
      lastExpressMap.set(instance, expressApp);
      console.log('Human1 SDK: Express app explicitly provided');
    } else if (appOrOptions) {
      // It's options
      options = appOrOptions;
      
      // Try auto-detection since no Express app was provided
      const expressApp = lastDetectedExpressApp || autoDetectExpressApp();
      if (expressApp) {
        // If we found an app, connect to it
        instance.express(expressApp);
        lastDetectedExpressApp = expressApp;
        lastExpressMap.set(instance, expressApp);
        console.log('Human1 SDK: Express app auto-detected during options initialization');
      }
    } else {
      // No arguments provided, try to auto-detect Express
      const expressApp = lastDetectedExpressApp || autoDetectExpressApp();
      
      if (expressApp) {
        // Store and connect to the app
        instance.express(expressApp);
        lastDetectedExpressApp = expressApp;
        lastExpressMap.set(instance, expressApp);
        console.log('Human1 SDK: Express app auto-detected during empty initialization');
      } else {
        console.log('Human1 SDK: No Express app detected');
      }
    }
    
    // Make sure environment is loaded with any options passed directly
    if (options && (options as any).env) {
      instance.init({ env: (options as any).env });
    } else if (!instance.isInitialized()) {
      // Load with default settings if not explicitly initialized before
      instance.init();
    }
    
    // Initialize the server
    const serverResult = instance.initializeServer(options);
    
    // If Express app is set, make SDK's environment config available
    const currentExpressApp = instance.getExpressApp();
    if (currentExpressApp) {
      try {
        // Some Express implementations may not have locals property
        if (currentExpressApp.locals) {
          currentExpressApp.locals.sdk = {
            envPath: instance.envConfig?.loadedEnvPath || 'Using process.env',
            serverInfo: serverResult
          };
        }
      } catch (error) {
        console.log('Human1 SDK: Could not set Express app locals', error);
      }
    }
    
    return serverResult;
  };
  
  /**
   * Override use method to automatically restore Express app if needed
   * 
   * This monkey patch ensures that even if the Express app reference is temporarily lost,
   * it can be recovered from the WeakMap when needed.
   */
  // Monkey patch the use method to auto-restore Express app if needed
  const originalUse = instance.use;
  instance.use = function(path: any, routes?: any): Human1 {
    // If expressApp is null but we have it stored, restore it
    const expressApp = instance.getExpressApp();
    if (!expressApp && lastExpressMap.has(instance)) {
      const storedApp = lastExpressMap.get(instance);
      if (storedApp) {
        instance.express(storedApp);
        console.log('Human1 SDK: Restored Express app reference');
      }
    }
    
    // Call original method
    return originalUse.call(instance, path, routes);
  };
  
  // Create the callable SDK object
  const callableSdk = makeCallable(instance, initializerFn) as unknown as CallableSDK;
  
  /**
   * More reliable implementation of getExpressApp in the callable SDK
   * 
   * This ensures the SDK returns the correct Express app after auto-detection
   * by using a hierarchical approach to finding the Express app:
   * 1. Check the instance's expressApp property
   * 2. Check the lastExpressMap for this instance
   * 3. Check the lastDetectedExpressApp global cache
   */
  const originalGetExpressApp = callableSdk.getExpressApp;
  callableSdk.getExpressApp = function(): Express | null {
    // First try the original method
    const expressApp = originalGetExpressApp.call(this);
    if (expressApp) {
      return expressApp;
    }
    
    // Next, try to get from lastExpressMap if not directly accessible
    if (lastExpressMap.has(instance)) {
      // The get method on WeakMap is guaranteed to return T or undefined
      const savedApp = lastExpressMap.get(instance);
      // TypeScript knows that if we're in this block, the app exists in the map
      // But we still need to handle undefined for typechecking (though it should never happen)
      if (savedApp) {
        // If found in map but not on instance, restore it
        instance.express(savedApp);
        return savedApp;
      }
    }
    
    // Finally, check the global lastDetectedExpressApp
    if (lastDetectedExpressApp) {
      // If we have a globally detected app but it's not on this instance, set it
      instance.express(lastDetectedExpressApp);
      return lastDetectedExpressApp;
    }
    
    return null;
  };
  
  return callableSdk;
}

/**
 * Legacy factory function for backwards compatibility
 * 
 * This provides the older human1() factory pattern while
 * delegating to the newer createSDK() implementation.
 */
export function human1(): CallableSDK {
  return createSDK();
} 