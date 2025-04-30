import axios from 'axios';

export interface QueryResult {
  type: 'table' | 'paragraph' | 'error';
  data: {
    text?: string | {
      columns?: string[],
      rows?: any[][],
      text?: string,
      message?: string,
      suggestions?: string[]
    }
  };
}

export interface QueryClient {
  query: (query: string) => Promise<QueryResult>;
}

const API_URL = 'http://localhost:3001';

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
  }
}; 