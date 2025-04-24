import { useState, useCallback } from 'react';

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
  query: (query: string) => Promise<QueryResult>;
}

interface UseNaturalLanguageQueryOptions {
  client: QueryClient;
  onSuccess?: (result: QueryResult) => void;
  onError?: (error: Error) => void;
}

export const useNaturalLanguageQuery = ({
  client,
  onSuccess,
  onError
}: UseNaturalLanguageQueryOptions) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const executeQuery = useCallback(async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const result = await client.query(query);
      setResult(result);
      onSuccess?.(result);
    } catch (error) {
      const errorResult: QueryResult = {
        type: 'error',
        data: {
          message: error instanceof Error ? error.message : 'An unknown error occurred',
          suggestions: ['Try rephrasing your question', 'Check for typos in your query']
        }
      };
      setResult(errorResult);
      onError?.(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [query, client, onSuccess, onError]);

  return {
    query,
    setQuery,
    result,
    isLoading,
    executeQuery
  };
}; 