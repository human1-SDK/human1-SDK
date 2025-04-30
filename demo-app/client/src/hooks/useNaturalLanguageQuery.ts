import { useState } from 'react';
import { ResponseData } from '../types';

interface UseNaturalLanguageQueryOptions {
  client: {
    executeQuery: (query: string) => Promise<ResponseData>;
  };
  onSuccess?: (result: ResponseData) => void;
  onError?: (error: Error) => void;
}

export const useNaturalLanguageQuery = (options: UseNaturalLanguageQueryOptions) => {
  const { client, onSuccess, onError } = options;
  
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<ResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const executeQuery = async (queryText: string) => {
    try {
      setIsLoading(true);
      setQuery(queryText);
      
      const response = await client.executeQuery(queryText);
      
      setResult(response);
      if (onSuccess) {
        onSuccess(response);
      }
      
      return response;
    } catch (error) {
      console.error('Error executing query:', error);
      if (onError && error instanceof Error) {
        onError(error);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    query,
    setQuery,
    result,
    isLoading,
    executeQuery
  };
}; 