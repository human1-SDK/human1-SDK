/**
 * Environment configuration utilities
 * Provides functions for discovering and loading .env files
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

/**
 * Options for environment configuration
 */
export interface EnvConfigOptions {
  /**
   * Custom path to .env file
   */
  customPath?: string;
  
  /**
   * Additional paths to search for .env files
   */
  additionalPaths?: string[];
  
  /**
   * Whether to log information about env loading
   */
  silent?: boolean;
}

/**
 * Result of loading environment variables
 */
export interface EnvConfigResult {
  /**
   * Path to the loaded .env file, or undefined if using process.env directly
   */
  loadedEnvPath?: string;
  
  /**
   * Whether environment variables were loaded successfully
   */
  success: boolean;
  
  /**
   * Any error that occurred during loading
   */
  error?: Error;
}

/**
 * Finds the most appropriate .env file by checking multiple locations
 * 
 * @param options Configuration options
 * @returns Path to the found .env file, or null if none found
 */
export function findEnvFile(options: EnvConfigOptions = {}): string | null {
  const { customPath, additionalPaths = [], silent = false } = options;
  
  // Check paths in order of priority
  const pathsToCheck: string[] = [];
  
  // 1. Custom path provided by the caller (highest priority)
  if (customPath) {
    pathsToCheck.push(customPath);
  }
  
  // 2. Server root directory (one level up from src)
  // This works for the typical structure where this module is in src/utils/
  const serverRootPath = path.resolve(__dirname, '../../.env');
  pathsToCheck.push(serverRootPath);
  
  // 3. Any additional search paths provided by the caller
  pathsToCheck.push(...additionalPaths);
  
  // 4. Current working directory
  const cwdPath = path.resolve(process.cwd(), '.env');
  pathsToCheck.push(cwdPath);
  
  // Check each path in order
  for (const envPath of pathsToCheck) {
    if (fs.existsSync(envPath)) {
      if (!silent) {
        console.log(`Found .env file at: ${envPath}`);
      }
      return envPath;
    }
  }
  
  // No .env file found
  if (!silent) {
    console.log('No .env file found in any of the search paths');
  }
  return null;
}

/**
 * Loads environment variables from the most appropriate source
 * 
 * @param options Configuration options
 * @returns Result of the loading operation, including the path used
 */
export function loadEnv(options: EnvConfigOptions = {}): EnvConfigResult {
  try {
    const envPath = findEnvFile(options);
    
    if (envPath) {
      dotenv.config({ path: envPath });
      if (!options.silent) {
        console.log(`Environment variables loaded from: ${envPath}`);
      }
      return { 
        loadedEnvPath: envPath,
        success: true 
      };
    } else {
      // Fall back to process.env
      dotenv.config();
      if (!options.silent) {
        console.log('Using environment variables from process.env');
      }
      return { 
        success: true 
      };
    }
  } catch (error) {
    if (!options.silent) {
      console.error('Error loading environment variables:', error);
    }
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
} 