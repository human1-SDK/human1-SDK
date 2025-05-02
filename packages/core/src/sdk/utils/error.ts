/**
 * Error Handling Utilities
 * 
 * This module provides custom error classes and error handling utilities.
 */

/**
 * Base SDK Error class
 */
export class SDKError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'SDKError';
    
    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, SDKError.prototype);
  }
}

/**
 * Error thrown when Express app detection fails
 */
export class ExpressDetectionError extends SDKError {
  constructor(message: string, public cause?: Error) {
    super(message, cause);
    this.name = 'ExpressDetectionError';
    
    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, ExpressDetectionError.prototype);
  }
}

/**
 * Error thrown when environment configuration fails
 */
export class EnvironmentError extends SDKError {
  constructor(message: string, public cause?: Error) {
    super(message, cause);
    this.name = 'EnvironmentError';
    
    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, EnvironmentError.prototype);
  }
}

/**
 * Safe try-catch wrapper with typed error handling
 * 
 * @param fn Function to execute
 * @param errorHandler Error handler function
 * @returns Result of the function or result of error handler
 */
export function tryCatch<T, E = any>(
  fn: () => T, 
  errorHandler: (error: E) => T
): T {
  try {
    return fn();
  } catch (error) {
    return errorHandler(error as E);
  }
} 