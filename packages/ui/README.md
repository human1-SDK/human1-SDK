# @human1-sdk/ui

React UI components for the Human1 SDK.

## Installation

```bash
npm install @human1-sdk/ui @human1-sdk/core
# or
yarn add @human1-sdk/ui @human1-sdk/core
```

## Usage

```tsx
import React from 'react';
import { Button, Card } from '@human1-sdk/ui';
import { Client } from '@human1-sdk/core';

// Initialize the client
const client = new Client({
  apiKey: 'your-api-key',
});

function MyComponent() {
  return (
    <Card>
      <h2>Human1 SDK Example</h2>
      <Button onClick={() => console.log('Button clicked')}>
        Click me
      </Button>
    </Card>
  );
} 