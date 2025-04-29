import React from 'react';
import { QueryInput, QueryResponseDisplay } from '@human1-sdk/ui';

interface QuerySectionProps {
  executeQuery: (query: string, responseFormat?: 'paragraph' | 'table') => void;
  isLoading: boolean;
  result: any;
}

const QuerySection: React.FC<QuerySectionProps> = ({
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

export default QuerySection;
