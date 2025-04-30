import React from 'react';
import { NavLink } from 'react-router-dom';

export const AppNavigation: React.FC = () => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) => {
    return `px-4 py-2 text-sm rounded-md font-medium transition-colors
      ${isActive 
        ? 'bg-blue-500 text-white shadow-sm' 
        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      }`;
  };

  return (
    <nav className="flex flex-wrap gap-2">
      <NavLink to="/page" className={navLinkClasses}>
        Page
      </NavLink>
      <NavLink to="/section" className={navLinkClasses}>
        Section
      </NavLink>

      <NavLink to="/explanation/hierarchy" className={({isActive}) => 
        `${navLinkClasses({isActive})} ${isActive ? 'bg-green-600' : 'bg-green-100 text-green-800 hover:bg-green-200'}`
      }>
        Explanation
      </NavLink>

      <NavLink to="/css" className={({isActive}) => 
        `${navLinkClasses({isActive})} ${isActive ? 'bg-purple-600' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'}`
      }>
        CSS
      </NavLink>
    </nav>
  );
}; 