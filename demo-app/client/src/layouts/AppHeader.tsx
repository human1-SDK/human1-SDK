import React from 'react';
import { AppNavigation } from '../navigation';

const AppHeader: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm p-4 mb-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
          <h1 className="text-xl font-bold text-gray-800 mb-3 md:mb-0">
            Human1 SDK Demo
          </h1>
          <AppNavigation />
        </div>
      </div>
    </header>
  );
};

export default AppHeader; 