/**
 * Express App Auto-Detection Module
 * 
 * This module provides automatic detection of Express applications.
 * It searches for Express app instances in various JavaScript runtime contexts
 * to enable seamless SDK integration without requiring explicit app configuration.
 */
import { Express } from 'express';
import { registerExpressApp } from './register';
import { autoDetectExpressApp } from './detect';
import './monkey-patch'; // Import for side effects (patching)

// Re-export the public API
export { registerExpressApp, autoDetectExpressApp }; 