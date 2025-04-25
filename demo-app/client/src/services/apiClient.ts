import axios from 'axios';
import { QueryClient, QueryResult } from '../hooks/useNaturalLanguageQuery';

const API_URL = 'http://localhost:3001';

// Create an API client to connect to our server
export const apiClient: QueryClient = {
  query: async (query: string): Promise<QueryResult> => {
    try {
      const response = await axios.post(`${API_URL}/api/query`, { query });
      console.log('response', response);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to execute query');
      }
      throw error;
    }
  }
}; 