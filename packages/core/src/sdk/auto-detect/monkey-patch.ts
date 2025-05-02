/**
 * Monkey Patching Module
 * 
 * This module provides runtime patching of the Express module to
 * automatically capture Express app instances as they're created.
 * It executes immediately when imported, installing hooks into Node.js
 * module system to intercept Express app creation.
 */
import { autoDetectExpressApp } from './detect';
import { registerExpressApp } from './register';
import { recentExpressInstances } from './shared';

/**
 * Monkey patch Express application creation
 * This executes immediately on module import to capture Express apps as early as possible
 */
try {
  // Hook into Express module resolution at the earliest possible point
  const Module = require('module');
  const originalRequire = Module.prototype.require;
  
  // Replace the module require function with our hooked version
  Module.prototype.require = function(id: string) {
    const result = originalRequire.apply(this, arguments as any);
    
    // If this is the express module, monkey-patch it
    if (id === 'express') {
      // Don't overwrite if already patched
      if (result && typeof result === 'function' && !result.__h1_patched) {
        const originalExpress = result;
        
        // Create our tracked version
        const trackedExpress = function(...args: any[]) {
          // Call the original to create the app
          const app = originalExpress(...args);
          
          // Register the app immediately
          registerExpressApp(app);
          
          return app;
        };
        
        // Copy all properties and mark it as patched
        Object.setPrototypeOf(trackedExpress, Object.getPrototypeOf(originalExpress));
        Object.assign(trackedExpress, originalExpress);
        trackedExpress.__h1_patched = true;
        
        return trackedExpress;
      }
    }
    
    return result;
  };
  
  // Preserve all properties and prototype
  Object.setPrototypeOf(Module.prototype.require, Object.getPrototypeOf(originalRequire));
  Object.assign(Module.prototype.require, originalRequire);
  
  // Also try to patch the existing module if it's already been loaded
  try {
    // Get the cached express module if it exists
    const cachedExpress = require.cache && require.cache[require.resolve('express')];
    if (cachedExpress && cachedExpress.exports && typeof cachedExpress.exports === 'function' && !cachedExpress.exports.__h1_patched) {
      const originalExpress = cachedExpress.exports;
      
      // Create our tracked version
      const trackedExpress = function(...args: any[]) {
        // Call the original to create the app
        const app = originalExpress(...args);
        
        // Register the app immediately
        registerExpressApp(app);
        
        return app;
      };
      
      // Copy all properties and mark it as patched
      Object.setPrototypeOf(trackedExpress, Object.getPrototypeOf(originalExpress));
      Object.assign(trackedExpress, originalExpress);
      trackedExpress.__h1_patched = true;
      
      // Replace the cached exports
      cachedExpress.exports = trackedExpress;
    }
  } catch (err) {
    // Ignore errors in patching cached module
  }
  
  // Track if express has already been required
  try {
    // If express is already in the cache, we need to add a listener for app creation
    if (require.cache && require.cache[require.resolve('express')]) {
      const express = require('express');
      // If express is already loaded and not patched, try to capture apps another way
      if (express && !express.__h1_patched) {
        // Try to capture apps by monkey patching process.nextTick
        const originalNextTick = process.nextTick;
        process.nextTick = function(callback: Function, ...args: any[]) {
          // Execute the original callback
          return originalNextTick.call(process, function(this: any) {
            // Look for Express apps after each tick
            setTimeout(() => {
              const possibleApp = autoDetectExpressApp();
              if (possibleApp && !recentExpressInstances.includes(possibleApp)) {
                registerExpressApp(possibleApp);
              }
            }, 0);
            
            // Call the original callback
            return callback.apply(this, arguments);
          }, ...args);
        };
      }
    }
  } catch (err) {
    // Ignore errors in this additional check
  }
} catch (err) {
  // Ignore patching errors - we'll fall back to other detection methods
  console.log('Human1 SDK: Express auto-detection module patching error (non-critical)', err);
} 