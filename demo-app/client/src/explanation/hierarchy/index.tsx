import React from 'react';

const HierarchyExplanation: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="space-y-8">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-6">
          <h1 className="text-2xl font-bold mb-4">Component Hierarchy Explanation</h1>
          <p className="text-gray-600 mb-6">
            This document explains the relationship between different component types in the Human1 SDK.
            Understanding this structure helps developers effectively use and extend the component library.
          </p>
        </div>
        
        <div className="p-4 md:p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Component Hierarchy Visualization</h2>
          <p className="text-gray-600 mb-6">
            The component architecture follows a feature-based organization pattern where 
            components are grouped by functionality rather than by hierarchy level. This approach improves discoverability
            and reduces duplication while maintaining composability.
          </p>
          
          <div className="flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl">
              <div className="p-8 border-4 border-blue-200 rounded-lg bg-blue-50">
                <div className="text-center font-bold text-blue-800 pb-4 border-b border-blue-200 mb-6">
                  FEATURE GROUP (e.g., query/)
                </div>
                
                <div className="p-6 border-2 border-green-200 rounded-lg bg-green-50 mb-4">
                  <div className="text-center font-bold text-green-800 pb-2 border-b border-green-200 mb-4">
                    FEATURE COMPONENT (e.g., Input/)
                  </div>
                  
                  <div className="flex flex-wrap gap-4 justify-center">
                    <div className="p-3 border-2 border-yellow-200 rounded-md bg-yellow-50 w-40">
                      <div className="text-center font-bold text-yellow-800 text-sm mb-2">
                        COMPONENT VARIANTS
                      </div>
                      <div className="p-2 border border-purple-200 rounded bg-purple-50">
                        <div className="text-center font-bold text-purple-800 text-xs">
                          (e.g., Demo/)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-2 border-purple-200 rounded-lg bg-purple-50 mb-4">
                  <div className="text-center font-bold text-purple-800 pb-2 border-b border-purple-200 mb-4">
                    LAYOUT COMPONENTS
                  </div>
                  
                  <div className="flex gap-3 justify-center">
                    <div className="p-2 border border-red-200 rounded bg-red-50 w-24">
                      <div className="text-center font-bold text-red-800 text-xs">
                        Header
                      </div>
                    </div>
                    <div className="p-2 border border-red-200 rounded bg-red-50 w-24">
                      <div className="text-center font-bold text-red-800 text-xs">
                        Footer
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 border-2 border-red-200 rounded-lg bg-red-50">
                  <div className="text-center font-bold text-red-800 pb-2 border-b border-red-200 mb-3">
                    ELEMENTS
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
                <h4 className="font-bold text-red-800 mb-2">Elements</h4>
                <p className="text-sm">
                  Atomic UI elements with specific functionality. These are organized in the elements/ directory,
                  with related components grouped together. Examples include:
                </p>
                <ul className="text-sm ml-4 mt-2 list-disc text-red-700">
                  <li>elements/Button/Button.tsx</li>
                  <li>elements/Display/ErrorDisplay/ErrorDisplay.tsx</li>
                  <li>elements/Display/ParagraphView/ParagraphView.tsx</li>
                  <li>elements/Display/TableView/TableView.tsx</li>
                </ul>
              </div>
              
              <div className="p-3 border border-purple-100 rounded bg-purple-50">
                <h4 className="font-bold text-purple-800 mb-2">Layout Components</h4>
                <p className="text-sm">
                  Components that define structure and positioning. After migration, these are providing a clear separation from content components. Examples include:
                </p>
                <ul className="text-sm ml-4 mt-2 list-disc text-purple-700">
                  <li>layout/Header/Header.tsx</li>
                  <li>layout/Footer/Footer.tsx</li>
                  <li>layout/Container/Container.tsx (new)</li>
                  <li>layout/Grid/Grid.tsx</li>
                </ul>
              </div>
              
              <div className="p-3 border border-yellow-100 rounded bg-yellow-50">
                <h4 className="font-bold text-yellow-800 mb-2">Feature Components</h4>
                <p className="text-sm">
                  Components are now organized by feature domain.
                  This allows related components to be grouped together regardless of complexity.
                  Examples from the query feature include:
                </p>
                <ul className="text-sm ml-4 mt-2 list-disc text-yellow-700">
                  <li>query/Input/QueryInput.tsx</li>
                  <li>query/Response/QueryResponseDisplay.tsx</li>
                  <li>query/Demo/Card/QueryDemoCard.tsx</li>
                  <li>query/Demo/Section/QueryDemoSection.tsx</li>
                </ul>
              </div>
              
              <div className="p-3 border border-green-100 rounded bg-green-50">
                <h4 className="font-bold text-green-800 mb-2">Component Variants</h4>
                <p className="text-sm">
                  Components are grouped by feature,
                  with variants organized in subdirectories. This reduces duplication and improves organization:
                </p>
                <ul className="text-sm ml-4 mt-2 list-disc text-green-700">
                  <li>query/Demo/Card/ - Card variant</li>
                  <li>query/Demo/Section/ - Section variant</li>
                  <li>query/Demo/Page/ - Page variant</li>
                  <li>All have unified exports via query/Demo/index.ts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HierarchyExplanation; 