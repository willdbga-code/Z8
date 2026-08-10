import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        experimental: resolve(import.meta.dirname, 'experimental-radian.html'),
        brandbook: resolve(import.meta.dirname, 'brandbook.html'),
        model3d: resolve(import.meta.dirname, 'model-3d.html'),
        landing: resolve(import.meta.dirname, 'landing.html'),
        n95c: resolve(import.meta.dirname, 'n95c.html')
      }
    }
  }
});
