import React from 'react';

interface HistoryItem {
  id: string | number;
  query: string;
  timestamp: string;
}

interface QueryHistoryProps {
  history: HistoryItem[];
  setQuery: (query: string) => void;
  executeQuery: (query: string) => void;
}

export const QueryHistory: React.FC<QueryHistoryProps> = ({
  history,
  setQuery,
  executeQuery
}) => {
  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="font-medium text-gray-900 mb-3">Recent Queries:</h3>
      <ul className="space-y-2">
        {history.map((item) => (
          <li 
            key={item.id} 
            className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
            onClick={() => {
              setQuery(item.query);
              executeQuery(item.query);
            }}
          >
            <p className="text-sm text-gray-700">{item.query}</p>
            <p className="text-xs text-gray-500">
              {new Date(item.timestamp).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}; 