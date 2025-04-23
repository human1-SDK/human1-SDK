# @human1-sdk/core

Core functionality for the Human1 SDK.

## Installation

```bash
npm install @human1-sdk/core
# or
yarn add @human1-sdk/core
```

## Usage

```typescript
import { Client } from '@human1-sdk/core';

// Initialize the client
const client = new Client({
  apiKey: 'your-api-key',
});

// Use the client
const response = await client.someMethod();
``` 