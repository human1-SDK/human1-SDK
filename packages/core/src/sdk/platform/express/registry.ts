/**
 * Express Registry Module
 * 
 * This module provides a registry for Express app instances.
 * It replaces the use of global state with a proper registry pattern
 * while maintaining backward compatibility.
 */
import { Express, ExpressRegistryOptions } from '../../types';

/**
 * Registry for Express app instances
 */
export class ExpressRegistry {
  /** Map of registered Express app instances */
  private static instances = new Map<string, Express>();
  
  /** Default registry name */
  private static readonly DEFAULT_NAME = 'default';

  /** Timestamp of last registration */
  private static lastRegistrationTime = 0;
  
  /**
   * Register an Express app instance
   * 
   * @param app Express app instance to register
   * @param options Registration options
   * @returns The registered app
   */
  static register(app: Express, options: ExpressRegistryOptions = {}): Express {
    const name = options.name || this.DEFAULT_NAME;
    this.instances.set(name, app);
    this.lastRegistrationTime = Date.now();
    
    // Ensure backward compatibility with global state
    this.syncWithGlobalState();
    
    return app;
  }
  
  /**
   * Get a registered Express app instance
   * 
   * @param name Name of the registered app
   * @returns The registered app or null if not found
   */
  static get(name: string = this.DEFAULT_NAME): Express | null {
    return this.instances.get(name) || null;
  }
  
  /**
   * Check if an Express app instance is registered
   * 
   * @param name Name of the registered app
   * @returns True if the app is registered, false otherwise
   */
  static has(name: string = this.DEFAULT_NAME): boolean {
    return this.instances.has(name);
  }
  
  /**
   * Get the timestamp of the last registration
   * 
   * @returns Timestamp of the last registration
   */
  static getLastRegistrationTime(): number {
    return this.lastRegistrationTime;
  }
  
  /**
   * Clear all registered Express app instances
   */
  static clear(): void {
    this.instances.clear();
  }
  
  /**
   * Synchronize registry with global state for backward compatibility
   */
  static syncWithGlobalState(): void {
    try {
      // Create the global context if not exists
      const globalObj = global as any;
      if (!globalObj.__h1_global_contexts) {
        globalObj.__h1_global_contexts = {
          expressApp: null,
          expressAppTimestamp: 0,
          sdkInstance: null
        };
      }
      
      // Get the default app from registry
      const app = this.get();
      
      // Sync from registry to global state
      if (app && !globalObj.__h1_global_contexts.expressApp) {
        globalObj.__h1_global_contexts.expressApp = app;
        globalObj.__h1_global_contexts.expressAppTimestamp = this.lastRegistrationTime;
      }
      // Sync from global state to registry
      else if (globalObj.__h1_global_contexts.expressApp && !this.has()) {
        this.register(globalObj.__h1_global_contexts.expressApp);
      }
    } catch (error) {
      console.warn('Failed to sync Express registry with global state:', error);
    }
  }
  
  /**
   * Check global state for Express app and register if found
   * 
   * @returns Express app from global state or null if not found
   */
  static checkGlobalState(): Express | null {
    try {
      const globalObj = global as any;
      if (globalObj.__h1_global_contexts && globalObj.__h1_global_contexts.expressApp) {
        const app = globalObj.__h1_global_contexts.expressApp;
        if (typeof app.use === 'function' && typeof app.listen === 'function') {
          // Register it in our registry if not already there
          if (!this.has()) {
            this.register(app);
          }
          return app;
        }
      }
    } catch (error) {
      console.warn('Failed to check global state for Express app:', error);
    }
    return null;
  }
} 