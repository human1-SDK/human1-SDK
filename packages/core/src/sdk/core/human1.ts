/**
 * Human1 SDK Core Class
 * 
 * This is the main implementation class for the Human1 SDK.
 * It provides core functionality for working with Express apps and environment.
 */
import { Express, SDKConfig } from '../types';
import { ExpressRegistry, registerExpressApp, detectExpressApp } from '../platform/express';
import { loadEnv } from '../../utils/env';
import { logger, EnvironmentError } from '../utils';
import { MESSAGES } from '../constants';

/**
 * Core SDK class that implements the Human1 functionality
 */
export class Human1 {
  /** Whether the SDK has been initialized */
  private initialized: boolean = false;
  
  /** Express app instance */
  private expressApp: Express | null = null;
  
  /** Environment configuration */
  private envConfig: { loadedEnvPath?: string } | null = null;
  
  /** SDK configuration */
  private config: SDKConfig;
  
  /**
   * Create a new Human1 SDK instance
   * 
   * @param config SDK configuration
   */
  constructor(config: SDKConfig) {
    this.config = config;
    
    // Check if Express app is provided in config
    if (config.express) {
      this.express(config.express);
    }
    
    // Store in global context for backward compatibility
    // This is similar to the original behavior
    const globalObj = global as any;
    if (!globalObj.__h1_global_contexts) {
      globalObj.__h1_global_contexts = {
        expressApp: null,
        expressAppTimestamp: 0,
        sdkInstance: null
      };
    }
    
    // Set this instance as the global SDK instance
    globalObj.__h1_global_contexts.sdkInstance = this;
  }
  
  /**
   * Initialize the SDK
   * 
   * @param options Initialization options (for backward compatibility)
   * @returns this instance for chaining
   */
  init(options: any = {}): Human1 {
    // Load environment if not already done
    if (!this.initialized) {
      this.loadEnvironment(options.env || {});
      this.initialized = true;
      
      console.log('\n-----------------------------------');
      console.log(MESSAGES.SDK_INIT);
      console.log(`Human1: ${MESSAGES.GREETING}`);
      console.log('-----------------------------------\n');
    }
    
    return this;
  }
  
  /**
   * Check if the SDK has been initialized
   * 
   * @returns True if initialized, false otherwise
   */
  isInitialized(): boolean {
    return this.initialized;
  }
  
  /**
   * Get the Express app instance
   * 
   * @returns Express app or null if not set
   */
  getExpressApp(): Express | null {
    // If we don't have an Express app, try to detect one
    if (!this.expressApp) {
      // First try the registry
      const result = detectExpressApp();
      if (result.app) {
        this.express(result.app);
        logger.info(`Found Express app from ${result.source}`);
      }
    }
    
    return this.expressApp;
  }
  
  /**
   * Load environment variables
   * 
   * @param options Environment options
   * @returns Environment configuration result
   */
  loadEnvironment(options: any = {}): any {
    try {
      const result = loadEnv({
        customPath: options.path,
        profile: options.profile,
        required: options.required,
        customVars: options.customVars,
        silent: options.silent
      });
      
      this.envConfig = {
        loadedEnvPath: result.loadedEnvPath
      };
      
      return result;
    } catch (error) {
      logger.error('Failed to load environment:', error);
      throw new EnvironmentError('Failed to load environment', error instanceof Error ? error : undefined);
    }
  }
  
  /**
   * Initialize the server component
   * 
   * @param options Server options
   * @returns Server initialization result
   */
  initializeServer(options: any = {}): any {
    try {
      // Import server functionality dynamically to maintain separation
      const { initializeServer } = require('../../server');
      return initializeServer(options);
    } catch (error) {
      logger.error('Failed to initialize server:', error);
      return { success: false, error };
    }
  }
  
  /**
   * Set the Express app instance
   * 
   * @param app Express app instance
   * @returns this instance for chaining
   */
  express(app: Express): Human1 {
    if (!app || typeof app.use !== 'function' || typeof app.listen !== 'function') {
      throw new Error('Invalid Express app provided');
    }
    
    this.expressApp = app;
    
    // Register the app in the registry
    registerExpressApp(app);
    
    return this;
  }
  
  /**
   * Mount routes on the Express app
   * 
   * @param path Base path for routes
   * @param routes Route handlers
   * @returns this instance for chaining
   */
  use(path: string | any, routes?: any): Human1 {
    const app = this.getExpressApp();
    
    if (!app) {
      throw new Error('No Express app available. Call express() first or ensure auto-detection works.');
    }
    
    // Handle both .use(routes) and .use(path, routes) patterns
    if (typeof routes === 'undefined') {
      app.use(path);
    } else {
      app.use(path, routes);
    }
    
    return this;
  }
} 