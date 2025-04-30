declare module '@human1-sdk/ui' {
  import { ReactNode, FC, CSSProperties } from 'react';
  
  export interface QueryInputProps {
    onSubmit: (query: string, responseFormat?: 'paragraph' | 'table') => void;
    isLoading?: boolean;
    placeholder?: string;
    initialValue?: string;
    width?: string | number;
    submitButtonLabel?: string;
    submitButtonClassName?: string;
    className?: string;
    style?: CSSProperties;
  }
  
  export interface TableData {
    columns: string[];
    rows: any[][];
  }
  
  export interface ParagraphData {
    text: string;
  }
  
  export interface ErrorData {
    message: string;
    query?: string;
    suggestions?: string[];
  }
  
  export type ResponseData = 
    | { type: 'table'; data: TableData } 
    | { type: 'paragraph'; data: ParagraphData }
    | { type: 'error'; data: ErrorData };
  
  export interface QueryResponseDisplayProps {
    data: ResponseData;
    title?: string;
    className?: string;
    style?: CSSProperties;
  }
  
  export interface UseNaturalLanguageQueryOptions {
    initialQuery?: string;
    client: {
      query: (query: string) => Promise<any>;
    };
    onBeforeQuery?: (query: string) => boolean | Promise<boolean>;
    onSuccess?: (result: ResponseData) => void;
    onError?: (error: Error) => void;
  }
  
  export interface UseNaturalLanguageQueryResult {
    query: string;
    setQuery: (query: string) => void;
    result: ResponseData | null;
    isLoading: boolean;
    error: Error | null;
    executeQuery: (queryText?: string, responseFormat?: "table" | "paragraph") => Promise<void>;
    reset: () => void;
  }
  
  export const QueryInput: FC<QueryInputProps>;
  export const QueryResponseDisplay: FC<QueryResponseDisplayProps>;
  export const TableView: FC<any>;
  export const ParagraphView: FC<any>;
  export const ErrorDisplay: FC<any>;
  
  export function useNaturalLanguageQuery(
    options: UseNaturalLanguageQueryOptions
  ): UseNaturalLanguageQueryResult;
  
  export function formatQueryResponse(response: any): ResponseData;
}

declare module '@human1-sdk/core' {
  export interface ClientOptions {
    apiKey: string;
    baseUrl?: string;
  }
  
  export class Client {
    constructor(options: ClientOptions);
    someMethod(): Promise<any>;
  }
}

// You can add custom type declarations here if needed.
// The package types should be provided by the SDK itself. 