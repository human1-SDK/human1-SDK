import React from 'react';

interface ExampleQueriesProps {
  setQuery: (query: string) => void;
  executeQuery: (query: string) => void;
  fetchHistory: () => void;
}

const ExampleQueries: React.FC<ExampleQueriesProps> = ({
  setQuery,
  executeQuery,
  fetchHistory
}) => {
  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-gray-900">Try these examples:</h3>
        <button 
          onClick={fetchHistory}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          View History
        </button>
      </div>
      <ul className="mt-2 space-y-1">
        <li className="text-blue-600 cursor-pointer hover:underline" 
            onClick={() => {
              setQuery("Show me the sales data by region");
              executeQuery("Show me the sales data by region");
            }}>
          "Show me the sales data by region"
        </li>
        <li className="text-blue-600 cursor-pointer hover:underline" 
            onClick={() => {
              executeQuery("Generate an error");
            }}>
          "Generate an error"
        </li>
      </ul>
    </div>
  );
};

export default ExampleQueries; 