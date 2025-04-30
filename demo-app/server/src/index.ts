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
  
  // Test with a second Express app
  console.log('\nTesting with a second Express app...');
  
  // Create a second Express app
  const app2 = express();
  app2.use(express.json());
  
  // Create a new SDK instance
  const newSdk = require('@human1-sdk/core').human1();
  
  // Try auto-detection with the second app
  console.log('Trying auto-detection for second app...');
  const result2 = newSdk();
  
  // Verify that the SDK properly detected our second Express app
  const detectedApp2 = newSdk.getExpressApp();
  if (!detectedApp2) {
    console.log('Second app auto-detection failed - setting app explicitly');
    newSdk.express(app2);
  } else if (detectedApp2 !== app2) {
    console.log('Wrong Express app detected for second app - correcting with explicit setting');
    newSdk.express(app2);
  } else {
    console.log('Second app auto-detection succeeded!');
  }
  
  // Start the second server
  const PORT2 = 3002;
  app2.listen(PORT2, () => {
    console.log(`\nSecond server running at http://localhost:${PORT2}\n`);
  });
}); 