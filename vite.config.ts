import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['@fatsolutions/tongo-sdk'],
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      external: ['@fatsolutions/tongo-sdk'],
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          privy: ['@privy-io/react-auth'],
        },
      },
    },
  },
  define: {
    global: 'globalThis',
  },
});
