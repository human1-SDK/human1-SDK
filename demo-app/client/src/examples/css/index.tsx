import React, { useState } from 'react';
import { ResponseData } from '../../types';
import { apiClient } from '../../services/apiClient';
import { useNaturalLanguageQuery } from '../../hooks/useNaturalLanguageQuery';

import { 
  QuerySection, 
  ExampleQueries, 
  QueryHistory, 
  HealthIndicator, 
  FileDropZone 
} from '@human1-sdk/ui';

import { API_URL, HEALTH_CHECK_INTERVAL } from '../../config';

interface HistoryItem {
  id: string | number;
  query: string;
  timestamp: string;
}

const CSSExample: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const {
    query,
    setQuery,
    result,
    isLoading,
    executeQuery
  } = useNaturalLanguageQuery({
    client: apiClient,
    onSuccess: (result: ResponseData) => {
      console.log('Query succeeded:', result);
    },
    onError: (error: Error) => console.error('Query failed:', error),
  });

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/api/query/history`);
      if (response.ok) {
        const data = await response.json();
        // Transform the API response into HistoryItem type
        const historyItems: HistoryItem[] = data.map((item: any) => ({
          id: item.id || Date.now(),
          query: item.query || '',
          timestamp: item.timestamp || new Date().toISOString()
        }));
        setHistory(historyItems);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const handleFilesAccepted = (files: File[]) => {
    console.log('Accepted files:', files);
    // TODO: Handle the files here
  };

  const handleValidationError = (errors: any[]) => {
    console.error('File validation errors:', errors);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Human1 SDK Demo</h1>
          <HealthIndicator 
            apiUrl={API_URL} 
            checkInterval={HEALTH_CHECK_INTERVAL}
            autoMonitor={true} 
          />
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <FileDropZone 
            onFilesSelected={handleFilesAccepted}
            onValidationError={handleValidationError}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <QuerySection 
            executeQuery={executeQuery}
            isLoading={isLoading}
            result={result}
          />
          
          <ExampleQueries 
            setQuery={setQuery}
            executeQuery={executeQuery}
            fetchHistory={fetchHistory}
          />
          
          {history.length > 0 && (
            <QueryHistory 
              history={history}
              setQuery={setQuery}
              executeQuery={executeQuery}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CSSExample; 