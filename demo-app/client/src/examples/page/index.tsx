import React from 'react';
import { NewQueryDemoPage } from '@human1-sdk/ui';

const PageExample: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="max-w-4xl mx-auto">
        <NewQueryDemoPage 
          initialQuery="What are the sales figures for Q1?" 
          defaultHeaderText="Sales Data Demo"
          defaultFooterText="© 2023 Example Corporation"
          title=""
          description=""
          demoMode={true}
          showSubmitGuidance={true}
          className="bg-white rounded-lg shadow overflow-hidden"
          containerClassName=""
          style={{ padding: 0 }}
        />
      </div>
    </div>
  );
};

export default PageExample; 