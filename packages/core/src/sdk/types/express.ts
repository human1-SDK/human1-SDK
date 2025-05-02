/**
 * Express Type Definitions
 * 
 * This file contains type definitions related to Express framework integration.
 */

// Import Express types - will be handled by @types/express in actual implementation
export interface Express {
  use: Function;
  listen: Function;
  locals?: any;
  [key: string]: any;
}

/**
 * Express app detection result
 */
export interface ExpressDetectionResult {
  app: Express | null;
  source: 'registry' | 'global' | 'auto-detection' | 'explicit' | 'none';
  timestamp: number;
}

/**
 * Express registry options
 */
export interface ExpressRegistryOptions {
  name?: string;
  metadata?: Record<string, any>;
} 