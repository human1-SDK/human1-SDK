import React from 'react';
import { QueryInput, QueryResponseDisplay } from '@human1-sdk/ui';

interface QuerySectionProps {
  executeQuery: (query: string) => void;
  isLoading: boolean;
  query: string;
  result: any;
}

const QuerySection: React.FC<QuerySectionProps> = ({
  executeQuery,
  isLoading,
  query,
  result
}) => {
  return (
    <>
      <QueryInput 
        onSubmit={executeQuery}
        isLoading={isLoading}
        initialValue={query}
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

export default QuerySection; 