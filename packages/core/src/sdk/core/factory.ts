/**
 * SDK Factory Module
 * 
 * This module provides factory functions for creating SDK instances.
 */
import { Express, SDKOptions, SDKConfig } from '../types';
import { Human1 } from './human1';
import { CallableSDK, makeCallable } from './callable';
import { logger } from '../utils';
import { MESSAGES, DEFAULTS } from '../constants';
import { isExpressApp, registerExpressApp } from '../platform/express';

/**
 * Default SDK configuration
 */
const DEFAULT_CONFIG: SDKConfig = {
  express: null,
  environment: {},
  logging: { level: DEFAULTS.LOG_LEVEL as any },
  advanced: {}
};

/**
 * Creates a new Human1 SDK instance
 * 
 * @param optionsOrApp Configuration options or Express app
 * @returns Callable SDK instance
 */
export function createSDK(optionsOrApp?: SDKOptions | Express): CallableSDK {
  let options: SDKOptions = {};
  let expressApp: Express | null = null;
  
  // Handle case where first argument is an Express app
  if (optionsOrApp && isExpressApp(optionsOrApp)) {
    expressApp = optionsOrApp as Express;
    logger.info(MESSAGES.EXPRESS_EXPLICIT);
  }
  // Handle options object
  else if (optionsOrApp) {
    options = optionsOrApp as SDKOptions;
    
    // Check if express property is an Express app
    if (options.express && isExpressApp(options.express)) {
      expressApp = options.express;
      logger.info(MESSAGES.EXPRESS_EXPLICIT);
    }
  }
  
  // Create a complete configuration by merging with defaults
  const config: SDKConfig = {
    ...DEFAULT_CONFIG,
    ...options,
    express: expressApp,
    environment: {
      ...DEFAULT_CONFIG.environment,
      ...(options.environment || {})
    },
    logging: {
      ...DEFAULT_CONFIG.logging,
      ...(options.logging || {})
    },
    advanced: {
      ...DEFAULT_CONFIG.advanced,
      ...(options.advanced || {})
    }
  };
  
  // Create the Human1 instance with the configuration
  const instance = new Human1(config);
  
  /**
   * Core initializer function that becomes the callable SDK
   * 
   * @param appOrOptions Express app or configuration options
   * @returns Result of initialization
   */
  const initializerFn = (appOrOptions?: any): any => {
    let config: SDKOptions = {};
    let app: Express | null = null;
    
    // Check if first argument is an Express app
    if (appOrOptions && isExpressApp(appOrOptions)) {
      app = appOrOptions as Express;
      logger.info(MESSAGES.EXPRESS_EXPLICIT);
      
      // Register the app for detection
      registerExpressApp(app);
      instance.express(app);
    }
    // Handle options object
    else if (appOrOptions && typeof appOrOptions === 'object') {
      config = appOrOptions;
    }
    
    // Initialize environment if not already done
    if (!instance.isInitialized()) {
      instance.init(config);
    }
    
    // Initialize the server
    return instance.initializeServer(config);
  };
  
  // Create the callable instance
  return makeCallable(instance, initializerFn);
}

/**
 * Legacy factory function for backward compatibility
 * 
 * @returns Callable SDK instance
 */
export function human1(): CallableSDK {
  return createSDK();
} 