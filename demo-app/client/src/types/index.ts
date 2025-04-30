// Define types for the API response
export interface ResponseData {
  type: 'success' | 'error';
  data: {
    result?: string;
    timestamp?: string;
    message?: string;
    details?: string;
    [key: string]: any; // Allow for additional properties
  };
} 