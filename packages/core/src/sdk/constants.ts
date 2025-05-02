/**
 * SDK Constants
 * 
 * This file contains constants used throughout the SDK.
 */

/**
 * Messages displayed to users
 */
export const MESSAGES = {
  SDK_INIT: 'Human1: SDK FUNCTIONALITY INITIALIZED...',
  GREETING: 'Hello from Human1 Core with HMR!!#$$$$#',
  EXPRESS_DETECTED: 'Human1 SDK: Using auto-detected Express app',
  EXPRESS_GLOBAL: 'Human1 SDK: Using globally captured Express app from factory',
  EXPRESS_EXPLICIT: 'Human1 SDK: Using explicitly provided Express app',
  EXPRESS_REGISTRY: 'Human1 SDK: Using Express app from registry',
  EXPRESS_NOT_FOUND: 'Human1 SDK: No Express app detected',
};

/**
 * Default configuration values
 */
export const DEFAULTS = {
  ENV_PATH: '.env',
  LOG_LEVEL: 'info',
  REGISTRY_NAME: 'default',
  EXPRESS_APP_TIMEOUT: 30000, // 30 seconds
};

/**
 * Global state keys (for backward compatibility)
 */
export const GLOBAL_KEYS = {
  CONTEXT: '__h1_global_contexts',
  EXPRESS_APP: 'expressApp',
  EXPRESS_TIMESTAMP: 'expressAppTimestamp',
  SDK_INSTANCE: 'sdkInstance',
}; 