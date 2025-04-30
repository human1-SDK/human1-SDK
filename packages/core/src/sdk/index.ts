/**
 * Human1 SDK Core Module
 * 
 * This is the entry point for the Human1 SDK. It exports the key components that
 * enable the Human1 SDK functionality, including the main Human1 class, callable
 * SDK wrapper, factory functions, and auto-detection functionality.
 * 
 * The default export is a pre-initialized SDK instance created by the factory.
 */

// Export component classes for advanced usage scenarios
export { Human1 } from './human1-class';
export { CallableSDK } from './callable-sdk';
export { createSDK, human1 } from './factory';
export { autoDetectExpressApp } from './auto-detect';

// Export the factory functions as default
// This creates a singleton SDK instance that's ready to use
import { createSDK } from './factory';
export default createSDK(); 