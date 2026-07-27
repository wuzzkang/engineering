import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3333,
    host: true
  },
  resolve: {
    alias: {
      '@wuzzkang/types': path.resolve(__dirname, '../../packages/types/index.js'),
      '@wuzzkang/renderer-core': path.resolve(__dirname, '../../packages/renderer-core/index.js')
    }
  }
});
