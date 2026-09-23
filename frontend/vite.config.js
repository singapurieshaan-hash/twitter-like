import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The dev server proxies API and Socket.IO traffic to the Express backend
// so the browser can use same-origin relative URLs like `/api/posts`.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
