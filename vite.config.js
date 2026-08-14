import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    port: 3000,
    host: true
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
