/**
 * Core types for Human1 SDK
 */

export interface ClientOptions {
  apiKey: string;
  baseUrl?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Function that takes a query string and returns a formatted message
 */
export type QueryLogger = (query: string) => string;

// Add more type definitions as needed 