import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import { existsSync } from 'fs';

// Check if we're in production mode
const isProd = process.env.NODE_ENV === 'production';
const uiDistDir = path.resolve(__dirname, '../../packages/ui/dist');
const hasUiDist = existsSync(uiDistDir);

// In production, use the built package if available
// In development, always use the source files for better HMR
const uiPath = isProd && hasUiDist
  ? path.resolve(__dirname, '../../packages/ui/dist')
  : path.resolve(__dirname, '../../packages/ui/src');

console.log(`Using UI path: ${uiPath} (${isProd ? 'production' : 'development'} mode)`);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Custom plugin to display the client URL when the server starts
    {
      name: 'show-client-url',
      configureServer(server) {
        const originalPrintUrls = server.printUrls;
        server.printUrls = () => {
          originalPrintUrls();
          console.log(`\n🌐  CLIENT URL: http://${server.resolvedUrls?.local[0].replace('localhost:', 'localhost:')}\n`);
        };
      }
    }
  ],
  resolve: {
    alias: {
      '@human1-sdk/ui': uiPath
    }
  },
  optimizeDeps: {
    include: ['@human1-sdk/ui'],
    // Force reoptimization in development for better HMR
    force: !isProd
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/, /packages\/ui/]
    }
  },
  server: {
    watch: {
      // Include UI package files in watch
      ignored: ['!**/packages/ui/src/**'],
    },
    hmr: {
      overlay: true,
    },
  }
});