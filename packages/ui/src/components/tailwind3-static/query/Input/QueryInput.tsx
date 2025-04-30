import React, { useState, FormEvent } from 'react';
import { QueryInputProps } from '../../../../types';

/**
 * QueryInput Component
 * 
 * A text input component for submitting natural language database queries
 * 
 * @example
 * ```tsx
 * <QueryInput 
 *   onSubmit={(query, type) => handleQuerySubmit(query, type)}
 *   placeholder="Ask a question..."
 * />
 * ```
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
  const [type, setType] = useState<'paragraph' | 'table'>('paragraph');
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query.trim(), type);
    }
  };

  return (
    <div className={`${className}`} style={{ width, ...style }}>
      <div className="flex mb-2">
        <div className="flex items-center">
          <label htmlFor="response-type" className="mr-2 text-sm">Response type:</label>
          <select 
            id="response-type"
            value={type}
            onChange={(e) => setType(e.target.value as 'paragraph' | 'table')}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Select response format"
          >
            <option value="paragraph">Paragraph</option>
            <option value="table">Table</option>
          </select>
        </div>
      </div>
      <form 
        onSubmit={handleSubmit} 
        className="flex flex-row"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-grow px-4 py-2.5 text-base border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          aria-label="Query input"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className={`px-4 py-2.5 bg-blue-500 text-white border-none rounded-r hover:bg-blue-600 ${isLoading || !query.trim() ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'} ${submitButtonClassName}`}
          aria-label={isLoading ? "Loading" : submitButtonLabel}
        >
          {isLoading ? 'Loading...' : submitButtonLabel}
        </button>
      </form>
    </div>
  );
};

QueryInput.displayName = 'QueryInput'; 