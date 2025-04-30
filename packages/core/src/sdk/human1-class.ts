import { Express } from 'express';
import { RouteDefinition } from '../server/routes';
import { extendExpressWithSdk } from '../server/express';
import { ServerResult } from '../server';

/**
 * Main Human1 class - the entry point to the SDK
 * 
 * The Human1 class is the core implementation of the SDK functionality.
 * It provides methods for:
 * - Initializing SDK configuration
 * - Loading environment variables
 * - Connecting to Express applications
 * - Mounting SDK routes
 * - Server initialization
 */
export class Human1 {
  /**
   * Whether the SDK has been initialized with environment variables
   */
  private initialized = false;
  
  /**
   * Contains environment configuration after loading
   */
  public envConfig: any;
  
  /**
   * Contains server configuration after initialization
   */
  public serverConfig: any;
  
  /**
   * Reference to the Express application instance
   */
  private expressApp: Express | null = null;
  
  /**
   * Environment options for configuration
   */
  private envOptions: {
    customPath?: string;
    additionalPaths?: string[];
    silent?: boolean;
    skip?: boolean;
  } = {};

  /**
   * Creates a new Human1 instance
   */
  constructor() {}

  /**
   * Initializes the Human1 SDK with the given configuration
   * 
   * This method loads environment variables and prepares the SDK
   * for server initialization. It's typically called automatically
   * by the factory function but can be called directly when needed.
   * 
   * (This is mainly kept for backward compatibility)
   * 
   * @param options Configuration options
   * @returns The initialized Human1 instance for chaining
   */
  init(options: {
    env?: {
      customPath?: string;
      additionalPaths?: string[];
      silent?: boolean;
      skip?: boolean;
    }
  } = {}) {
    // Store env options for later use
    this.envOptions = options.env || {};
    
    // Only load environment variables if explicitly asked
    if (options.env && !options.env.skip) {
      this.loadEnvironment();
    }
    
    this.initialized = true;
    return this;
  }

  /**
   * Check if SDK has been initialized
   * 
   * @returns True if SDK has been initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get the Express app if set
   * 
   * This method attempts to retrieve the Express app from multiple sources:
   * 1. The instance's expressApp property
   * 2. The global __h1_sdk_detected_app (set by auto-detection)
   * 3. The global __h1_express_app (legacy support)
   * 
   * @returns The Express app or null
   */
  getExpressApp(): Express | null {
    // If we already have an expressApp stored, return it
    if (this.expressApp) {
      return this.expressApp;
    }
    
    // Check if we can retrieve it from the global context as fallback
    // This helps in cases where the expressApp wasn't properly attached to this instance
    const globalObj = global as any;
    if (globalObj.__h1_sdk_detected_app) {
      // Found a previously detected app from the auto-detection
      this.expressApp = globalObj.__h1_sdk_detected_app;
      return this.expressApp;
    }
    
    if (globalObj.__h1_express_app) {
      // Found an app that was directly set globally
      this.expressApp = globalObj.__h1_express_app;
      return this.expressApp;
    }
    
    return null;
  }

  /**
   * Loads environment variables using stored options
   * 
   * This method loads environment variables from:
   * - Custom path if specified
   * - Additional paths if specified
   * - Default .env file
   * 
   * @private
   */
  private loadEnvironment() {
    const { loadEnv } = require('../utils/env');
    this.envConfig = loadEnv({
      customPath: this.envOptions.customPath,
      additionalPaths: this.envOptions.additionalPaths,
      silent: this.envOptions.silent
    });
    return this.envConfig;
  }

  /**
   * Initializes the server functionality
   * 
   * This method sets up the server configuration and prepares
   * the SDK for handling API requests. It ensures environment
   * variables are loaded first.
   * 
   * @param options Server options and/or environment options
   * @returns Server configuration
   */
  initializeServer(options: any = {}) {
    // Make sure env is loaded at least once
    if (!this.initialized || !this.envConfig) {
      // If env options provided directly to this call, use them
      if (options.env) {
        this.envOptions = options.env;
      }
      // Load environment
      this.loadEnvironment();
      this.initialized = true;
    }
    
    const { initializeServer } = require('../server');
    this.serverConfig = initializeServer({
      ...options,
      skipEnvLoad: true // Environment is already loaded by Human1.loadEnvironment()
    });
    
    return this.serverConfig;
  }

  /**
   * Sets the Express application for integration
   * 
   * This method establishes the connection between the SDK and the Express app.
   * It extends the Express app with SDK functionality and stores it globally
   * for future reference.
   * 
   * @param app Express application instance
   * @returns The Human1 instance for chaining
   */
  express(app: Express): Human1 {
    this.expressApp = app;
    if (app) {
      extendExpressWithSdk(app);
      
      // Also store the app globally for future sdk instances
      const globalObj = global as any;
      globalObj.__h1_sdk_detected_app = app;
    }
    return this;
  }

  /**
   * Mounts routes to the Express application
   * 
   * This method adds the SDK routes to the Express app, allowing it to handle
   * API requests. It works similarly to Express's app.use() method.
   * 
   * @param path Base path for the routes (or routes if only one argument is provided)
   * @param routes Route definitions (optional if path contains the routes)
   * @returns The Human1 instance for chaining
   */
  use(path: string | RouteDefinition[], routes?: RouteDefinition[]): Human1 {
    if (!this.expressApp) {
      throw new Error('Express app not set. Call sdk.express(app) before sdk.use()');
    }

    if (Array.isArray(path)) {
      // If first argument is routes array
      this.expressApp.useSdk('/api', path);
    } else {
      // If path and routes are provided
      this.expressApp.useSdk(path, routes as RouteDefinition[]);
    }
    
    return this;
  }
} 