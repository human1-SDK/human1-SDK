import { Express } from 'express';
import { Human1 } from './human1-class';
import { ServerResult } from '../server';

/**
 * Type for the callable Human1 SDK
 * 
 * This interface extends the Human1 class to make it callable as a function.
 * It defines the hybrid object/function type that represents the SDK instance
 * returned by createSDK().
 * 
 * This pattern allows users to:
 * 1. Call the SDK directly: sdk()
 * 2. Use it as an object with methods: sdk.express(), sdk.use()
 * 
 * Both approaches provide access to the same underlying SDK functionality.
 */
export interface CallableSDK extends Human1 {
  /**
   * Initialize the server when called as a function
   * 
   * This function signature allows the SDK to be called directly,
   * accepting either an Express app instance or configuration options.
   * It handles auto-detection of Express apps when no arguments are provided.
   * 
   * @param appOrOptions Express app instance or configuration options.
   *                     For most reliable usage, it's recommended to pass the Express app explicitly.
   * @returns Server initialization result
   * 
   * @example
   * // RECOMMENDED: Initialize with Express app passed explicitly
   * const app = express();
   * const serverResult = sdk(app);
   * 
   * @example
   * // ALTERNATIVE: Initialize with auto-detection (less reliable)
   * // Note: This may not reliably detect the correct Express app
   * const serverResult = sdk();
   * // Check if detection worked and explicitly set the app if needed
   * if (!sdk.getExpressApp()) {
   *   sdk.express(app);
   * }
   * 
   * @example
   * // Initialize with only options
   * const serverResult = sdk({ env: { customPath: '.env.local' } });
   */
  (appOrOptions?: Express | {
    env?: {
      customPath?: string;
      additionalPaths?: string[];
      silent?: boolean;
      skip?: boolean;
    }
  }): ServerResult;
} 