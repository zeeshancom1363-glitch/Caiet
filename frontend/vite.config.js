// ============================================
// FILE: vite.config.js
// WHAT IT DOES: Configures the Vite dev server
// for our React frontend. Sets up React plugin
// and proxies API requests to the backend.
// ============================================
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
