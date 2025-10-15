import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@uv/types': resolve(__dirname, '../../packages/uv-types/src'),
      '@uv/render-core': resolve(__dirname, '../../packages/uv-render-core-adapter/src'),
      '@uv/layers': resolve(__dirname, '../../packages/uv-layers/src')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  optimizeDeps: {
    exclude: ['cesium']
  }
});