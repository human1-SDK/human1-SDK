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

// Step 2: Initialize the SDK with auto-detection
console.log('\nInitializing SDK with auto-detection...');
const serverResult = sdk();

// Verify that the SDK properly detected our Express app
const detectedApp = sdk.getExpressApp();
if (!detectedApp) {
  console.log('Express app auto-detection failed - setting app explicitly');
  sdk.express(app);
} else if (detectedApp !== app) {
  console.log('Wrong Express app detected - correcting with explicit setting');
  sdk.express(app);
} else {
  console.log('Express app auto-detection succeeded!');
}

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