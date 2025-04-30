import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { MainLayout } from './layouts';
import { AppRoutes } from './routes';

function App() {
  return (
    <Router>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </Router>

    // <div className="min-h-screen bg-gray-50 p-8">
    //   <div className="max-w-4xl mx-auto space-y-6">
    //     <div className="flex justify-between items-center">
    //       <h1 className="text-3xl font-bold text-gray-900">Human1 SDK Demo</h1>
    //       <HealthIndicator status={healthStatus} />
    //     </div>
        
    //     <div className="bg-white rounded-lg shadow p-6">
    //       <FileDropZone 
    //         onFilesSelected={handleFilesAccepted}
    //       />
    //     </div>

    //     <div className="bg-white rounded-lg shadow p-6">
    //       <QuerySection 
    //         executeQuery={executeQuery}
    //         isLoading={isLoading}
    //         result={result}
    //       />
          
    //       <ExampleQueries 
    //         setQuery={setQuery}
    //         executeQuery={executeQuery}
    //         fetchHistory={fetchHistory}
    //       />
          
    //       {history.length > 0 && (
    //         <QueryHistory 
    //           history={history}
    //           setQuery={setQuery}
    //           executeQuery={executeQuery}
    //         />
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
}

export default App;