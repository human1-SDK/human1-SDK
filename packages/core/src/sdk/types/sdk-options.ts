/**
 * SDK Options Type Definitions
 * 
 * This file contains type definitions for SDK configuration options.
 */
import { Express } from './express';

/**
 * Environment configuration options
 */
export interface EnvironmentOptions {
  /** Path to environment file */
  path?: string;
  /** Environment profile (e.g., 'development', 'production') */
  profile?: string;
  /** List of required environment variables */
  required?: string[];
  /** Custom environment variables to set */
  customVars?: Record<string, string>;
}

/**
 * Logging configuration options
 */
export interface LoggingOptions {
  /** Log level */
  level?: 'debug' | 'info' | 'warn' | 'error';
  /** Whether to enable logging */
  enabled?: boolean;
  /** Custom logger instance */
  logger?: any;
}

/**
 * SDK Configuration options
 */
export interface SDKOptions {
  /** Express app instance */
  express?: Express | null;
  /** Environment configuration */
  environment?: EnvironmentOptions;
  /** Logging configuration */
  logging?: LoggingOptions;
  /** Advanced configuration options */
  advanced?: Record<string, any>;
}

/**
 * Complete SDK Configuration with defaults applied
 */
export interface SDKConfig {
  /** Express app instance */
  express: Express | null;
  /** Environment configuration */
  environment: EnvironmentOptions;
  /** Logging configuration */
  logging: LoggingOptions;
  /** Advanced configuration options */
  advanced: Record<string, any>;
} 