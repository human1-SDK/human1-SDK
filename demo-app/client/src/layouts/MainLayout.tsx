import React from 'react';
import AppHeader from './AppHeader';
import { AppNavigation } from '../navigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppHeader />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default MainLayout; 