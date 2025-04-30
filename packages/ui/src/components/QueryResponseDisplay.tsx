import React from 'react';
import { QueryResponseDisplayProps } from '../types';
import { TableView } from './TableView';
import { ParagraphView } from './ParagraphView';
import { ErrorDisplay } from './ErrorDisplay';

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
          <TableView data={'text' in data.data && typeof data.data.text === 'string' 
            ? JSON.parse(data.data.text) 
            : data.data} 
          />
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