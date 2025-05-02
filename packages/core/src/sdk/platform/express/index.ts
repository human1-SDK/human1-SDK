/**
 * Express Platform Module Index
 * 
 * This file exports functionality related to Express framework integration.
 */

// Export detection and registry functionality
export * from './detector';
export * from './registry';

// Export key types
import { Express } from '../../types';
export type { Express }; 