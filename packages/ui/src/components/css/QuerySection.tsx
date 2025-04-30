import React from 'react';
import { QueryInput } from './QueryInput';
import { QueryResponseDisplay } from './QueryResponseDisplay';

interface QuerySectionProps {
  executeQuery: (query: string, responseFormat?: 'paragraph' | 'table') => void;
  isLoading: boolean;
  result: any;
}

export const QuerySection: React.FC<QuerySectionProps> = ({
  executeQuery,
  isLoading,
  result,
}) => {
  return (
    <>
      <QueryInput
        onSubmit={executeQuery}
        isLoading={isLoading}
        placeholder="Ask a question about your data..."
        className="mb-6"
      />

      {result && (
        <div className="mt-8">
          <QueryResponseDisplay
            data={result}
            className="border rounded-lg p-4"
          />
        </div>
      )}
    </>
  );
}; 
