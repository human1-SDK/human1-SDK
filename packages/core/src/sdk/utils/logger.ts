/**
 * Logging Utilities
 * 
 * This module provides logging functionality for the SDK.
 */
import { LoggingOptions } from '../types';
import { DEFAULTS } from '../constants';

/**
 * Log levels
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Logger interface
 */
export interface Logger {
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
}

/**
 * SDK Logger implementation
 */
export class SDKLogger implements Logger {
  private enabled: boolean;
  private level: LogLevel;
  
  /**
   * Create a new logger
   * 
   * @param options Logging options
   */
  constructor(options: LoggingOptions = {}) {
    this.enabled = options.enabled !== false;
    this.level = options.level || DEFAULTS.LOG_LEVEL as LogLevel;
  }
  
  /**
   * Get numeric value for log level
   * 
   * @param level Log level
   * @returns Numeric value (higher = more severe)
   */
  private getLevelValue(level: LogLevel): number {
    switch (level) {
      case 'debug': return 0;
      case 'info': return 1;
      case 'warn': return 2;
      case 'error': return 3;
      default: return 1;
    }
  }
  
  /**
   * Check if a log level should be displayed
   * 
   * @param level Log level to check
   * @returns True if the level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    return this.enabled && this.getLevelValue(level) >= this.getLevelValue(this.level);
  }
  
  /**
   * Log a debug message
   * 
   * @param message Message to log
   * @param args Additional arguments
   */
  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.log(`[Human1 SDK:DEBUG] ${message}`, ...args);
    }
  }
  
  /**
   * Log an info message
   * 
   * @param message Message to log
   * @param args Additional arguments
   */
  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.log(`[Human1 SDK] ${message}`, ...args);
    }
  }
  
  /**
   * Log a warning message
   * 
   * @param message Message to log
   * @param args Additional arguments
   */
  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(`[Human1 SDK:WARN] ${message}`, ...args);
    }
  }
  
  /**
   * Log an error message
   * 
   * @param message Message to log
   * @param args Additional arguments
   */
  error(message: string, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(`[Human1 SDK:ERROR] ${message}`, ...args);
    }
  }
  
  /**
   * Set the log level
   * 
   * @param level New log level
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }
  
  /**
   * Enable or disable logging
   * 
   * @param enabled Whether logging should be enabled
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

// Create a default logger instance
export const logger = new SDKLogger(); 