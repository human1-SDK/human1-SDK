import { useState, useCallback } from 'react';
import { formatQueryResponse } from '../utils/formatters';
import { ResponseData } from '../types';

/**
 * Generic client type for making natural language queries
 * This can be implemented to call your backend where Human1 Core is running
 */
type ClientType = {
  /**
   * Send a natural language query and return the response
   * @param query The natural language query string
   * @returns Promise resolving to the query response
   */
  query: (query: string, responseFormat?: 'table' | 'paragraph') => Promise<any>;
};

interface UseNaturalLanguageQueryOptions {
  /**
   * Optional initial query text
   */
  initialQuery?: string;
  /**
   * An API client that implements the ClientType interface
   * This should communicate with your backend where Human1 Core is running
   */
  client: ClientType;
  /**
   * Optional callback to run before query execution
   */
  onBeforeQuery?: (query: string) => boolean | Promise<boolean>;
  /**
   * Optional callback for successful queries
   */
  onSuccess?: (result: ResponseData) => void;
  /**
   * Optional callback for query errors
   */
  onError?: (error: Error) => void;
}

interface UseNaturalLanguageQueryResult {
  /**
   * Current query text
   */
  query: string;
  /**
   * Function to update the query text
   */
  setQuery: (query: string) => void;
  /**
   * Query response data
   */
  result: ResponseData | null;
  /**
   * Loading state
   */
  isLoading: boolean;
  /**
   * Error object if query failed
   */
  error: Error | null;
  /**
   * Function to execute the query
   */
  executeQuery: (queryText?: string, responseFormat?: 'table' | 'paragraph') => Promise<void>;
  /**
   * Reset the query state
   */
  reset: () => void;
}

/**
 * Hook for working with natural language queries through an API client
 */
export const useNaturalLanguageQuery = (
  options: UseNaturalLanguageQueryOptions
): UseNaturalLanguageQueryResult => {
  const { client, initialQuery = '', onBeforeQuery, onSuccess, onError } = options;

  const [query, setQuery] = useState(initialQuery);
  const [result, setResult] = useState<ResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const executeQuery = useCallback(async (queryText?: string, responseFormat?: 'table' | 'paragraph') => {
    const queryToExecute = queryText || query;
    
    if (!queryToExecute.trim()) {
      return;
    }

    // Allow cancellation via the onBeforeQuery callback
    if (onBeforeQuery) {
      const shouldContinue = await onBeforeQuery(queryToExecute);
      if (shouldContinue === false) {
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await client.query(queryToExecute, responseFormat);
      let formattedResult = formatQueryResponse(response);
      
      // Enforce the requested format type if provided
      if (responseFormat && formattedResult.type !== 'error') {
        formattedResult = {
          ...formattedResult,
          type: responseFormat
        } as ResponseData;
      }
      
      setResult(formattedResult);
      
      if (onSuccess) {
        onSuccess(formattedResult);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      
      // Create an error response
      const errorResult: ResponseData = {
        type: 'error',
        data: {
          message: error.message,
          suggestions: ['Check your query syntax', 'Try rephrasing your question']
        }
      };
      setResult(errorResult);
      
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [query, client, onBeforeQuery, onSuccess, onError]);

  const reset = useCallback(() => {
    setQuery('');
    setResult(null);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    result,
    isLoading,
    error,
    executeQuery,
    reset
  };
}; 