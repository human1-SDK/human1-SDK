import axios from 'axios';
import { ResponseData } from '../types';
import { API_URL } from '../config';

export interface QueryResult {
  type: 'table' | 'paragraph' | 'error';
  data: {
    columns?: string[];
    rows?: any[][];
    text?: string;
    message?: string;
    suggestions?: string[];
  };
}

export interface QueryClient {
  query: (query: string, responseFormat?: "table" | "paragraph") => Promise<QueryResult>;
  executeQuery: (query: string) => Promise<ResponseData>;
}

// Create an API client to connect to our server
export const apiClient: QueryClient = {
  query: async (query: string, responseFormat?: "table" | "paragraph"): Promise<QueryResult> => {
    console.log({query, responseFormat});
    try {
      const response = await axios.post(`${API_URL}/api/query`, { query, responseFormat });
      console.log('response', response);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to execute query');
      }
      throw error;
    }
  },
  // Add executeQuery method that returns ResponseData
  executeQuery: async (query: string): Promise<ResponseData> => {
    try {
      const response = await axios.post(`${API_URL}/api/query`, { query });
      return response.data as ResponseData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to execute query');
      }
      throw error;
    }
  }
};