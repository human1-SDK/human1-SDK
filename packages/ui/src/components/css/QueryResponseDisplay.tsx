import React from 'react';
import { QueryResponseDisplayProps, ResponseData } from '../../types';
import { TableView } from './TableView';
import { ParagraphView } from './ParagraphView';
import { ErrorDisplay } from './ErrorDisplay';

/**
 * Safely attempts to parse a JSON string
 * @param text - The text to parse
 * @returns Parsed object or null if parsing fails
 */
const tryParseJson = (text: string) => {
  if (!text) return null;
  
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
};

/**
 * Checks if the data has an error structure either directly or within its data property
 */
const hasErrorData = (data: any): boolean => {
  // Check if it's already an error type
  if (data.type === 'error') return true;
  
  // Check for error property in the raw response (sometimes comes from API)
  if (data.error) return true;
  
  // Check for error in the data property
  if (data.data && data.data.error) return true;
  
  return false;
};

/**
 * Extracts error message from different error formats
 */
const getErrorMessage = (data: any): string => {
  if (data.type === 'error' && data.data && data.data.message) {
    return data.data.message;
  }
  
  if (data.error) {
    return typeof data.error === 'string' ? data.error : 
           (data.error.message || 'Unknown error');
  }
  
  if (data.data && data.data.error) {
    return typeof data.data.error === 'string' ? data.data.error : 
           (data.data.error.message || 'Unknown error');
  }
  
  return 'Unknown error';
};

/**
 * QueryResponseDisplay Component
 * 
 * Main display component that renders the appropriate view based on the response type
 */
export const QueryResponseDisplay: React.FC<QueryResponseDisplayProps> = ({
  data,
  title,
  className = '',
  style,
}) => {
  if (!data) {
    return null;
  }

  // If the data contains an error, display it as an error
  if (hasErrorData(data)) {
    const errorMessage = getErrorMessage(data);
    
    const errorData = {
      message: errorMessage,
      suggestions: ['Try a different query', 'Check database connection']
    };
    
    return (
      <div 
        className={`human1-response-container ${className}`}
        style={{ 
          marginTop: '20px',
          ...style
        }}
      >
        {title && (
          <h3 style={{ 
            margin: '0 0 16px',
            fontSize: '20px',
            fontWeight: 600,
          }}>
            {title}
          </h3>
        )}
        <ErrorDisplay data={errorData} />
      </div>
    );
  }

  // Function to determine if we should try to display as a table
  const getTableData = (responseData: any) => {
    // If the data already has the right structure, use it
    if (responseData && responseData.columns && responseData.rows) {
      return responseData;
    }

    // If data.text is a string, try to parse it as JSON
    if (responseData && typeof responseData.text === 'string') {
      const parsedJson = tryParseJson(responseData.text);
      if (parsedJson && parsedJson.columns && parsedJson.rows) {
        return parsedJson;
      }
    }

    // Return original data
    return responseData;
  };

  return (
    <div 
      className={`human1-response-container ${className}`}
      style={{ 
        marginTop: '20px',
        ...style
      }}
    >
      {title && (
        <h3 style={{ 
          margin: '0 0 16px',
          fontSize: '20px',
          fontWeight: 600,
        }}>
          {title}
        </h3>
      )}

      {data.type === 'table' && (
        <TableView data={getTableData(data.data)} />
      )}

      {data.type === 'paragraph' && (
        <ParagraphView data={data.data} />
      )}

      {data.type === 'error' && (
        <ErrorDisplay data={data.data} />
      )}
    </div>
  );
}; 