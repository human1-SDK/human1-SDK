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

  /**
   * Environment profile (e.g., 'development', 'production')
   * Adds a suffix to the .env file, like .env.development
   */
  profile?: string;

  /**
   * List of required environment variables
   * Will throw an error if any are missing
   */
  required?: string[];

  /**
   * Custom environment variables to set
   */
  customVars?: Record<string, string>;
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

  /**
   * Environment variables
   */
  vars?: NodeJS.ProcessEnv;
}

/**
 * Find the most appropriate .env file with optional profile suffix
 * 
 * @param options Configuration options
 * @returns Path to the found .env file, or null if none found
 */
export function findEnvFile(options: EnvConfigOptions = {}): string | null {
  const { 
    customPath, 
    additionalPaths = [], 
    silent = false,
    profile
  } = options;
  
  // Add profile suffix if specified
  const suffix = profile ? `.${profile}` : '';

  // Function to check both with and without profile suffix
  const checkPath = (basePath: string): string | null => {
    // First check with profile suffix if specified
    if (profile) {
      const profilePath = basePath.endsWith('.env') 
        ? basePath.replace('.env', `.env${suffix}`)
        : `${basePath}${suffix}`;
      
      if (fs.existsSync(profilePath)) {
        if (!silent) {
          console.log(`Found profile .env file at: ${profilePath}`);
        }
        return profilePath;
      }
    }
    
    // Then check without suffix
    if (fs.existsSync(basePath)) {
      if (!silent) {
        console.log(`Found .env file at: ${basePath}`);
      }
      return basePath;
    }
    
    return null;
  };
  
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
    const foundPath = checkPath(envPath);
    if (foundPath) {
      return foundPath;
    }
  }
  
  // No .env file found
  if (!silent) {
    console.log('No .env file found in any of the search paths');
  }
  return null;
}

/**
 * Validate that required environment variables are set
 * 
 * @param required List of required environment variables
 * @throws Error if any required variables are missing
 */
export function validateRequiredVars(required: string[]): void {
  const missing = required.filter(name => !process.env[name]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

/**
 * Loads environment variables from the most appropriate source
 * 
 * @param options Configuration options or custom path (for backward compatibility)
 * @returns Result of the loading operation, including the path used
 */
export function loadEnv(options: EnvConfigOptions | string = {}): EnvConfigResult {
  try {
    // Handle backward compatibility with string argument
    const opts: EnvConfigOptions = typeof options === 'string' 
      ? { customPath: options } 
      : options;
    
    const envPath = findEnvFile(opts);
    
    if (envPath) {
      // Load the environment file
      const result = dotenv.config({ path: envPath });
      
      if (!opts.silent) {
        console.log(`Environment variables loaded from: ${envPath}`);
      }
      
      // Apply custom variables if provided
      if (opts.customVars) {
        Object.entries(opts.customVars).forEach(([key, value]) => {
          process.env[key] = value;
        });
      }
      
      // Validate required variables if specified
      if (opts.required && opts.required.length > 0) {
        validateRequiredVars(opts.required);
      }
      
      return { 
        loadedEnvPath: envPath,
        success: true,
        vars: process.env
      };
    } else {
      // Fall back to process.env
      dotenv.config();
      
      if (!opts.silent) {
        console.log('Using environment variables from process.env');
      }
      
      // Validate required variables if specified
      if (opts.required && opts.required.length > 0) {
        validateRequiredVars(opts.required);
      }
      
      return { 
        success: true,
        vars: process.env
      };
    }
  } catch (error) {
    if (!options || !(options as EnvConfigOptions).silent) {
      console.error('Error loading environment variables:', error);
    }
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
} 