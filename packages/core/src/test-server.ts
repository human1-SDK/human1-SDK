// Test script to verify the Human1 SDK functionality
import { human1 } from './index';

console.log('Starting Human1 SDK test...');

// Initialize the Human1 SDK
const sdk = human1().init();

// Initialize core functionality
const serverResult = sdk.initializeServer();

// Show the server result
console.log('\nHuman1 SDK initialization result:');
console.log(JSON.stringify(serverResult, null, 2));
console.log('\nTest completed successfully!\n'); 