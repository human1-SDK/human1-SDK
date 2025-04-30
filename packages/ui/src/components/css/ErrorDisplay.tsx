import React from 'react';
import { ErrorDisplayProps } from '../../types';

/**
 * ErrorDisplay Component
 * 
 * Displays error messages in a formatted way
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  data,
  className = '',
  style,
}) => {
  if (!data) {
    return null;
  }

  const { message, query, suggestions } = data;
  
  return (
    <div 
      className={`human1-error-container ${className}`}
      style={{ 
        padding: '16px',
        borderRadius: '4px',
        backgroundColor: '#FFF5F5',
        border: '1px solid #FFCCCC',
        color: '#E53E3E',
        ...style
      }}
    >
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        marginBottom: (query || suggestions?.length) ? '12px' : '0'
      }}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          style={{ marginRight: '8px' }}
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <div style={{ 
          fontWeight: 600,
          fontSize: '16px',
        }}>
          {message}
        </div>
      </div>
      
      {query && (
        <div style={{ 
          marginTop: '8px',
          padding: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '3px',
          fontSize: '14px',
          whiteSpace: 'pre-wrap',
          overflow: 'auto',
          fontFamily: 'monospace'
        }}>
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>Query:</div>
          {query}
        </div>
      )}

      {suggestions && suggestions.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>Suggestions:</div>
          <ul style={{ 
            marginLeft: '20px',
            paddingLeft: '0'
          }}>
            {suggestions.map((suggestion, index) => (
              <li key={index} style={{ marginBottom: '4px' }}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}; 