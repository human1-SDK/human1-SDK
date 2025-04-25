import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
  ],
  optimizeDeps: {
    include: ['@human1-sdk/ui'],
    force: true
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  resolve: {
    preserveSymlinks: true
  }
}); 