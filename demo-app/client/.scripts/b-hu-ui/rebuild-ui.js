#!/usr/bin/env node

import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get current file's directory with ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes for output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
};

// Calculate the absolute path to the UI SDK
const uiSdkRelativePath = '../../human1-SDK/packages/ui';
const clientRoot = path.resolve(__dirname, '../..');
const projectRoot = path.resolve(clientRoot, '..');
const uiSdkPath = path.resolve(projectRoot, uiSdkRelativePath);

console.log(`${colors.yellow}Starting rebuild of @human1-sdk/ui package...${colors.reset}`);

// Check if UI SDK directory exists
if (!fs.existsSync(uiSdkPath)) {
  console.error(`${colors.red}Error: UI SDK directory not found at ${uiSdkPath}${colors.reset}`);
  process.exit(1);
}

console.log(`${colors.yellow}Building @human1-sdk/ui at ${uiSdkPath}...${colors.reset}`);

// Clean the dist folder
const distPath = path.join(uiSdkPath, 'dist');
if (fs.existsSync(distPath)) {
  console.log(`${colors.yellow}Cleaning previous build...${colors.reset}`);
  try {
    fs.rmSync(distPath, { recursive: true, force: true });
  } catch (err) {
    console.error(`${colors.red}Failed to clean dist directory: ${err.message}${colors.reset}`);
  }
}

// Execute the build command
exec('npm run build', { cwd: uiSdkPath }, (error, stdout, stderr) => {
  if (error) {
    console.error(`${colors.red}Failed to rebuild @human1-sdk/ui package: ${error.message}${colors.reset}`);
    console.error(stderr);
    process.exit(1);
  }
  
  console.log(stdout);
  console.log(`${colors.green}@human1-sdk/ui package rebuilt successfully!${colors.reset}`);
  process.exit(0);
}); 