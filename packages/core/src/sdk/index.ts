/**
 * Human1 SDK Module Index
 * 
 * This is the main entry point for the SDK. It exports the factory functions,
 * main classes, and utility functions needed to use the SDK.
 * 
 * For backward compatibility, it maintains the same exports as the original SDK.
 */

// Re-export the original exports for backward compatibility
export { autoDetectExpressApp } from './auto-detect';

// Export from the new implementation
import { Human1, CallableSDK, createSDK, human1 } from './core';
export { Human1 } from './core';
export { CallableSDK } from './core';
export { createSDK, human1 } from './core';

// Export from platform modules
export { registerExpressApp } from './platform/express';

// Re-export as default for the most common use case
// This creates a singleton SDK instance that's ready to use
export default createSDK(); 