import { loadEnv } from '../utils/env';
import { executeQuery, getQueryHistory, RequestData, ResponseData } from './controllers/queryController';
import { routes, RouteDefinition, getRouteHandler } from './routes';
import { GREETING_MESSAGE } from '../index';

/**
 * Options for server creation
 */
export interface ServerOptions {
  /**
   * Path to .env file to load environment variables from
   */
  envPath?: string;
  
  /**
   * Whether to skip loading environment variables
   * Useful when environment variables are already loaded by the consumer
   */
  skipEnvLoad?: boolean;
  
  /**
   * Additional paths to check for .env files
   */
  additionalEnvPaths?: string[];
  
  /**
   * Whether to silence environment loading logs
   */
  silentEnvLoad?: boolean;
}

/**
 * Result of server initialization
 */
export interface ServerResult {
  /**
   * Status of the initialization
   */
  status: 'initialized';
  
  /**
   * Loaded environment path
   */
  loadedEnvPath?: string;
  
  /**
   * Available routes
   */
  availableRoutes: RouteDefinition[];
}

// Function to initialize the server functionality
export function initializeServer(options: ServerOptions = {}): ServerResult {
  // Load environment variables only if not skipped
  const envResult = !options.skipEnvLoad 
    ? loadEnv({
        customPath: options.envPath,
        additionalPaths: options.additionalEnvPaths,
        silent: options.silentEnvLoad
      })
    : { loadedEnvPath: options.envPath };

  // Log the imported GREETING_MESSAGE at startup
  console.log('\n-----------------------------------');
  console.log('Human1: SDK FUNCTIONALITY INITIALIZED...');
  console.log(`Human1: ${GREETING_MESSAGE}`);
  console.log('-----------------------------------\n');

  return {
    status: 'initialized',
    loadedEnvPath: envResult.loadedEnvPath,
    availableRoutes: routes
  };
}

/**
 * Process a query using the SDK
 * 
 * @param requestData Request data containing query and other parameters
 * @returns Response with status and data
 */
export function processQuery(requestData: RequestData): Promise<ResponseData> {
  return executeQuery(requestData);
}

/**
 * Get query history
 * 
 * @returns Response with status and history data
 */
export function getHistory(): ResponseData {
  return getQueryHistory();
}

// Export controller functions for direct usage
export { executeQuery, getQueryHistory };

// Export types
export { RequestData, ResponseData } from './controllers/queryController';
export { RouteDefinition } from './routes';

// Export routes
export { routes, getRouteHandler };

// Export Express utilities
export * from './express'; 