import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  resolve: {
    alias: {
      '@vercel/analytics': resolve(import.meta.dirname, 'scripts/analytics-mock.js')
    }
  },
  server: {
    port: 3004,
    host: true,
    allowedHosts: true
  },
  css: {
    postcss: {}
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        principal: resolve(import.meta.dirname, 'site-principal/index.html'),
        vendas: resolve(import.meta.dirname, 'vendas/index.html'),
        n95c: resolve(import.meta.dirname, 'n95c/index.html')
      }
    }
  }
});
