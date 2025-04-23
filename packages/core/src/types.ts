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

// Add more type definitions as needed 