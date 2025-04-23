import React from 'react';
import { ErrorDisplayProps } from '../types';

/**
 * ErrorDisplay Component
 * 
 * Displays error messages with suggestions when a query fails
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  data,
  className = '',
  style,
}) => {
  if (!data || !data.message) {
    return (
      <div className={`human1-error-fallback ${className}`}>
        An unknown error occurred
      </div>
    );
  }

  return (
    <div 
      className={`human1-error-container ${className}`}
      style={{ 
        padding: '16px',
        borderRadius: '4px',
        backgroundColor: '#fff8f8',
        border: '1px solid #ffcdd2',
        color: '#d32f2f',
        ...style
      }}
    >
      <h4 style={{ 
        margin: '0 0 12px',
        fontWeight: 600,
        fontSize: '18px'
      }}>
        Error
      </h4>
      
      <p style={{ 
        margin: '0 0 16px',
        fontSize: '16px',
      }}>
        {data.message}
      </p>

      {data.query && (
        <div style={{ 
          margin: '16px 0',
          padding: '12px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '14px',
          overflowX: 'auto',
        }}>
          <code>{data.query}</code>
        </div>
      )}

      {data.suggestions && data.suggestions.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <h5 style={{ 
            margin: '0 0 8px',
            fontWeight: 600,
            fontSize: '16px',
            color: '#333',
          }}>
            Suggestions:
          </h5>
          <ul style={{ 
            margin: '0',
            paddingLeft: '20px',
            color: '#333',
          }}>
            {data.suggestions.map((suggestion, index) => (
              <li key={`suggestion-${index}`} style={{ margin: '4px 0' }}>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}; 