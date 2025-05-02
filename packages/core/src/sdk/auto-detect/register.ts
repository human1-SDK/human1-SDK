/**
 * Express App Registration Module
 * 
 * This module provides functionality to register Express app instances
 * with the auto-detection system, making them available for later use.
 */
import { Express } from 'express';
import { globalObj, recentExpressInstances } from './shared';

/**
 * Register an Express app instance for later auto-detection
 * This function is used to keep track of Express instances as they're created
 * 
 * @param app The Express app to register
 */
export function registerExpressApp(app: Express): void {
  if (app && typeof app.use === 'function' && typeof app.listen === 'function') {
    // Store the app in our tracking array
    if (!recentExpressInstances.includes(app)) {
      recentExpressInstances.push(app);
    }
    
    // Also store it in the global context for immediate access
    globalObj.__h1_global_contexts.expressApp = app;
    globalObj.__h1_global_contexts.expressAppTimestamp = Date.now();
    
    // Store for legacy support
    globalObj.__h1_sdk_detected_app = app;
    globalObj.__h1_express_app = app;
    
    console.log('Human1 SDK: Express app captured via global hook');
  }
} 