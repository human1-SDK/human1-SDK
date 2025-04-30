import express from 'express';
import cors from 'cors';
import path from 'path';
import { routes as appRoutes } from './routes';
// Import the SDK directly (this is the cleanest approach)
import sdk, { 
  GREETING_MESSAGE, 
  routes as sdkRoutes
} from '@human1-sdk/core';

// Log the imported GREETING_MESSAGE at startup
console.log('\n-----------------------------------');
console.log('DEMO APP SERVER STARTING...');
console.log(`CORE MESSAGE: ${GREETING_MESSAGE}`);
console.log('-----------------------------------\n');

// Step 1: Create the Express apps first
const app = express();
app.use(cors());
app.use(express.json());

// Step 2: Initialize the SDK by passing the Express app directly
console.log('\nInitializing SDK with Express app...');
const serverResult = sdk(app);    // @TODO: make this const serverResult = sdk() and remove the app parameter.

// Mount demo app routes using Express
app.use('/', appRoutes);

// Mount SDK routes
console.log('Mounting SDK routes...');
sdk.use('/api', sdkRoutes);

// Start the server
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
app.listen(PORT, () => {
  console.log(`\n🖥️  DEMO APP SERVER URL: http://localhost:${PORT}\n`);
}); 