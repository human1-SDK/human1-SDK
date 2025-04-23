# @human1-sdk/ui

React UI components for the Human1 SDK - natural language database query interface.

This package provides React components to easily integrate natural language database querying capabilities into your existing applications. It offers a simple query input component and various result display components.

## Installation

```bash
npm install @human1-sdk/ui
# or
yarn add @human1-sdk/ui
```

## Usage

### Basic Query Interface

```tsx
import React from 'react';
import { QueryInput, QueryResponseDisplay } from '@human1-sdk/ui';

// You'll need to create an API client that interfaces with your backend
// where @human1-sdk/core is running
const apiClient = {
  query: async (query) => {
    const response = await fetch('your-backend-endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    
    return response.json();
  }
};

function DatabaseQueryWidget() {
  const [result, setResult] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleQuery = async (query) => {
    setIsLoading(true);
    try {
      const response = await apiClient.query(query);
      setResult(response);
    } catch (error) {
      console.error('Query error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <QueryInput onSubmit={handleQuery} isLoading={isLoading} />
      {result && <QueryResponseDisplay data={result} />}
    </div>
  );
}
```

### Display Options

The `QueryResponseDisplay` component automatically formats the response based on the returned data type:

- Table view for structured data
- Paragraph view for natural language responses
- Error handling with suggested corrections

## Components

- `QueryInput`: Text input for natural language queries
- `QueryResponseDisplay`: Main display component for query results
- `TableView`: Displays structured data in a table format
- `ParagraphView`: Displays natural language responses
- `ErrorDisplay`: Shows errors with suggestions

## API Client Requirements

Your API client (which communicates with your backend where the Human1 Core SDK is running) should:

1. Provide a `query` method that accepts a string and returns a Promise
2. Return responses in one of these formats:
   - Table format: `{ columns: string[], rows: any[][] }`
   - Text format: `{ text: string }`
   - Error format: `{ error: { message: string, query?: string, suggestions?: string[] } }`

## Customization

All components accept custom styling via the `className` and `style` props.

## Development

```bash
# Install dependencies
npm install

# Run Storybook to develop and test components
npm run storybook

# Run tests
npm test

# Build the package
npm run build
``` 