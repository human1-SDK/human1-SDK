import React, { useState, FormEvent } from 'react';
import { QueryInputProps } from '../../types';

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
  const [responseFormat, setResponseFormat] = useState<'paragraph' | 'table'>('paragraph');
  

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      console.log("responseFormat", responseFormat);
      onSubmit(query.trim(), responseFormat);
    }
  };

  return (
    <div className={className} style={{ width, ...style }}>
      <div style={{ display: 'flex', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ marginRight: '8px', fontSize: '14px' }}>Response type:</label>
          <select 
            value={responseFormat}
            onChange={(e) => setResponseFormat(e.target.value as 'paragraph' | 'table')}
            style={{
              padding: '4px 8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value="paragraph">Paragraph</option>
            <option value="table">Table</option>
          </select>
        </div>
      </div>
      <form 
        onSubmit={handleSubmit} 
        className={`human1-query-input`}
        style={{ 
          display: 'flex', 
          flexDirection: 'row'
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
    </div>
  );
}; 