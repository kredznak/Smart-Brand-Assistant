import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2022',
    sourcemap: true,
    rollupOptions: {
      input: {
        iframe: 'src/iframe.ts',
        document: 'src/document.ts',
        index: 'index.html'
      },
      output: {
        entryFileNames: assetInfo => {
          if (assetInfo.name === 'iframe') return 'iframe.js';
          if (assetInfo.name === 'document') return 'document.js';
          return '[name].js';
        },
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true
      }
    }
  }
});

