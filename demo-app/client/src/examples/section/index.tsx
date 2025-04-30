import React from 'react';
import { NewQueryDemoSection } from '@human1-sdk/ui';

const SectionExample: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="max-w-4xl mx-auto">
        <NewQueryDemoSection
          title=""
          description=""
          initialQuery="What are the sales figures for Q1?"
          placeholderText="Ask a question about your data..."
          submitButtonLabel="Submit Query"
          demoMode={true}
          showHeader={true}
          headerText="Sales Data Demo"
          showFooter={true}
          footerText="© 2023 Example Corporation"
          showSubmitGuidance={true}
          guidanceText="Try submitting the query to see response data!"
          className="bg-white rounded-lg shadow overflow-hidden"
          style={{ padding: 0 }}
        />
      </div>
    </div>
  );
};

export default SectionExample; 