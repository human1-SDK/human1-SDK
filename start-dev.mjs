#!/usr/bin/env node

import { spawn } from 'child_process';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __dirname = dirname(fileURLToPath(import.meta.url));

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

/**
 * Run a command in a specific directory
 * @param {string} command - The command to run
 * @param {string[]} args - Arguments for the command
 * @param {string} cwd - Working directory
 * @param {string} label - Label for log output
 * @param {string} color - Color for log output
 * @returns {Promise<void>}
 */
function runCommand(command, args, cwd, label, color) {
  console.log(`${color}${colors.bright}Starting ${label}...${colors.reset}`);
  
  const proc = spawn(command, args, {
    cwd: resolve(__dirname, cwd),
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: process.platform === 'win32'
  });
  
  // Handle standard output
  proc.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    for (const line of lines) {
      if (line.trim()) {
        console.log(`${color}[${label}] ${colors.reset}${line}`);
      }
    }
  });
  
  // Handle standard error
  proc.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    for (const line of lines) {
      if (line.trim()) {
        console.log(`${color}${colors.bright}[${label} ERROR] ${colors.reset}${line}`);
      }
    }
  });
  
  // Handle process exit
  proc.on('close', (code) => {
    if (code !== 0) {
      console.log(`${colors.red}${colors.bright}[${label}] Process exited with code ${code}${colors.reset}`);
    } else {
      console.log(`${color}${colors.bright}[${label}] Process completed successfully${colors.reset}`);
    }
  });
  
  return proc;
}

// Start both applications
console.log(`${colors.bright}${colors.white}Human1 SDK Development Environment${colors.reset}`);
console.log(`${colors.dim}Starting client and server applications...${colors.reset}\n`);

// Start the server
const server = runCommand('npm', ['run', 'dev'], 'demo-app/server', 'SERVER', colors.cyan);

// Wait a bit for the server to start
setTimeout(() => {
  // Start the client
  const client = runCommand('npm', ['run', 'dev'], 'demo-app/client', 'CLIENT', colors.green);
  
  // Handle SIGINT (Ctrl+C)
  process.on('SIGINT', () => {
    console.log(`\n${colors.yellow}${colors.bright}Shutting down applications...${colors.reset}`);
    server.kill();
    client.kill();
  });
}, 2000); 