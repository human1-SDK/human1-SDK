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

// Step 1: Create the Express app first
const app = express();

app.use(cors());
app.use(express.json());

// Step 2: Initialize the SDK with auto-detection
// The SDK will auto-detect the Express app
console.log('Initializing SDK with auto-detection...');

// METHOD 1: Auto-detection (simplest)
// SDK will automatically detect the Express app instance
const coreSdk = sdk();

// METHOD 2: Explicit app passing
// const coreSdk = sdk(app);

// METHOD 3: With options object
// const coreSdk = sdk({
//   express: app,
//   environment: {
//     profile: 'development',
//     required: ['API_KEY']
//   },
//   logging: {
//     level: 'debug'
//   }
// });

// METHOD 4: Register first, then initialize
// import { registerExpressApp } from '@human1-sdk/core';
// registerExpressApp(app);
// const coreSdk = sdk();

// METHOD 5: Using the Registry API directly
// import { ExpressRegistry } from '@human1-sdk/core/platform/express';
// ExpressRegistry.register(app);
// const coreSdk = sdk();

// METHOD 6: Using the SDK instance as a callable function
// Get the SDK instance first with any of the methods above
// const coreSdk = sdk();
// Then later, initialize server with the instance as a function:
// const serverResult = coreSdk();
// This is useful when you want to initialize the SDK first, then initialize server later

// METHOD 7: Using the imported SDK directly as a function (ultra concise)
// import sdk from '@human1-sdk/core';
// sdk(); // Initializes with auto-detection
// sdk(app); // Initializes with explicit app
// sdk.use('/api', routes); // Uses the singleton instance

// Mount demo app routes using Express
app.use('/', appRoutes);

// Mount SDK routes using the initialized instance
console.log('Mounting SDK routes...');
coreSdk.use('/api', sdkRoutes);

// Start the server
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
app.listen(PORT, () => {
  console.log(`\n🖥️  DEMO APP SERVER URL: http://localhost:${PORT}\n`);
}); 