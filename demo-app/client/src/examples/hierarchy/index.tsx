import React from 'react';

const HierarchyExample: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="space-y-8">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-6">
          <h1 className="text-2xl font-bold mb-4">Component Hierarchy</h1>
          <p className="text-gray-600 mb-6">
            This visualization shows the relationship between different component types in the Human1 SDK,
            following a hierarchical pattern from base components to full pages.
          </p>
        </div>
        
        <div className="p-4 md:p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Component Hierarchy Visualization</h2>
          <p className="text-gray-600 mb-6">
            The component architecture follows a modular, composable pattern where simpler components 
            are combined to create more complex ones, providing flexibility and reusability.
          </p>
          
          <div className="flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl">
              <div className="p-8 border-4 border-blue-200 rounded-lg bg-blue-50">
                <div className="text-center font-bold text-blue-800 pb-4 border-b border-blue-200 mb-6">
                  PAGE COMPONENT
                </div>
                
                <div className="p-6 border-2 border-green-200 rounded-lg bg-green-50 mb-4">
                  <div className="text-center font-bold text-green-800 pb-2 border-b border-green-200 mb-4">
                    SECTION COMPONENT
                  </div>
                  
                  <div className="flex flex-wrap gap-4 justify-center">
                    <div className="p-3 border-2 border-yellow-200 rounded-md bg-yellow-50 w-40">
                      <div className="text-center font-bold text-yellow-800 text-sm mb-2">
                        CARD COMPONENT
                      </div>
                      <div className="p-2 border border-purple-200 rounded bg-purple-50">
                        <div className="text-center font-bold text-purple-800 text-xs">
                          COMPOUND
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-2 border-purple-200 rounded-lg bg-purple-50 mb-4">
                  <div className="text-center font-bold text-purple-800 pb-2 border-b border-purple-200 mb-4">
                    COMPOUND COMPONENT
                  </div>
                  
                  <div className="flex gap-3 justify-center">
                    <div className="p-2 border border-red-200 rounded bg-red-50 w-24">
                      <div className="text-center font-bold text-red-800 text-xs">
                        BASE
                      </div>
                    </div>
                    <div className="p-2 border border-red-200 rounded bg-red-50 w-24">
                      <div className="text-center font-bold text-red-800 text-xs">
                        BASE
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 border-2 border-red-200 rounded-lg bg-red-50">
                  <div className="text-center font-bold text-red-800 pb-2 border-b border-red-200 mb-3">
                    BASE COMPONENT
                  </div>
                  <div className="text-center text-sm text-red-700">
                    Foundational UI elements
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-medium mb-4">Component Types Explained</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 border border-red-100 rounded bg-red-50">
                <h4 className="font-bold text-red-800 mb-2">Base Components</h4>
                <p className="text-sm">
                  Atomic UI elements with specific functionality (buttons, tables, displays).
                  These are the building blocks for all other components.
                </p>
              </div>
              
              <div className="p-3 border border-purple-100 rounded bg-purple-50">
                <h4 className="font-bold text-purple-800 mb-2">Compound Components</h4>
                <p className="text-sm">
                  Combinations of base components that work together to provide more complex functionality
                  (query inputs, response displays).
                </p>
              </div>
              
              <div className="p-3 border border-yellow-100 rounded bg-yellow-50">
                <h4 className="font-bold text-yellow-800 mb-2">Card Components</h4>
                <p className="text-sm">
                  Wrapper components that present content in a consistent card-based layout with
                  shared styling and structure.
                </p>
              </div>
              
              <div className="p-3 border border-green-100 rounded bg-green-50">
                <h4 className="font-bold text-green-800 mb-2">Section Components</h4>
                <p className="text-sm">
                  Larger functional areas that implement specific features or workflows,
                  often combining multiple compound or card components.
                </p>
              </div>
              
              <div className="p-3 border border-blue-100 rounded bg-blue-50 md:col-span-2">
                <h4 className="font-bold text-blue-800 mb-2">Page Components</h4>
                <p className="text-sm">
                  Complete page layouts that organize sections into a cohesive user interface with
                  navigation, headers, footers, and overall structure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HierarchyExample; 