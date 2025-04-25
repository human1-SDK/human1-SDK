import React, { useState, useEffect } from 'react';
import { useNaturalLanguageQuery } from '@human1-sdk/ui';
import { ResponseData } from '@human1-sdk/ui';
import { apiClient } from './services/apiClient';
import QuerySection from './components/QuerySection';
import ExampleQueries from './components/ExampleQueries';
import QueryHistory from './components/QueryHistory';
import { HealthIndicator, HealthStatus } from './components/HealthIndicator';
import { startHealthMonitoring } from './services/healthCheck';
import { FileDropZone } from './components/FileDropZone/index';

interface HistoryItem {
  id: string | number;
  query: string;
  timestamp: string;
}

function App() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [healthStatus, setHealthStatus] = useState<HealthStatus>('unhealthy');
  
  useEffect(() => {
    const cleanup = startHealthMonitoring(setHealthStatus);
    return cleanup;
  }, []);

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
      const response = await fetch('http://localhost:3001/api/query/history');
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Human1 SDK Demo</h1>
          <HealthIndicator status={healthStatus} />
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <FileDropZone 
            onFilesSelected={handleFilesAccepted}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <QuerySection 
            executeQuery={executeQuery}
            isLoading={isLoading}
            query={query}
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
}

export default App; 