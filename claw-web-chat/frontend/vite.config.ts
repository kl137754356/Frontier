import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/agent': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        // Disable buffering for SSE streaming
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            // Ensure no buffering for SSE
            proxyRes.headers['cache-control'] = 'no-cache';
            proxyRes.headers['x-accel-buffering'] = 'no';
          });
        },
      },
      '/config': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/reset': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/slash': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/a2ui-event': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/heartbeat': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/heartbeat-results': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/a2ui-test': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['cache-control'] = 'no-cache';
            proxyRes.headers['x-accel-buffering'] = 'no';
          });
        },
      },
      '/auth': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/a2a-agents': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/sessions': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/cancel': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/restart': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
});
