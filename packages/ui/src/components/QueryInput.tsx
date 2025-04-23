import React, { useState, FormEvent } from 'react';
import { QueryInputProps } from '../types';

/**
 * QueryInput Component
 * 
 * A text input component for submitting natural language database queries
 */
export const QueryInput: React.FC<QueryInputProps> = ({
  onSubmit,
  isLoading = false,
  placeholder = 'Ask a question about your data...',
  initialValue = '',
  width = '100%',
  submitButtonLabel = 'Query',
  submitButtonClassName = '',
  className = '',
  style,
}) => {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query.trim());
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`human1-query-input ${className}`}
      style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        width,
        ...style 
      }}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        disabled={isLoading}
        style={{
          flexGrow: 1,
          padding: '10px 16px',
          fontSize: '16px',
          border: '1px solid #ccc',
          borderRadius: '4px 0 0 4px',
          outline: 'none',
        }}
      />
      <button
        type="submit"
        disabled={isLoading || !query.trim()}
        className={`human1-query-submit ${submitButtonClassName}`}
        style={{
          padding: '10px 16px',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '0 4px 4px 0',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading || !query.trim() ? 0.7 : 1,
        }}
      >
        {isLoading ? 'Loading...' : submitButtonLabel}
      </button>
    </form>
  );
}; 