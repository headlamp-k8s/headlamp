import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import svgr from 'vite-plugin-svgr';

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  clearScreen: false,
  define: {
    global: 'globalThis',
  },
  envPrefix: ['REACT_APP_', 'TAURI_ENV_*'],
  base: process.env.PUBLIC_URL,
  server: {
    port: 3000,
    host: host || false,
    proxy: {
      '/plugins': {
        target: 'http://localhost:4466',
        changeOrigin: true,
      },
    },
    cors: true,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
  plugins: [
    svgr({
      svgrOptions: {
        prettier: false,
        svgo: false,
        svgoConfig: {
          plugins: [{ removeViewBox: false }],
        },
        titleProp: true,
        ref: true,
      },
    }),
    react(),
    nodePolyfills({
      include: ['process', 'buffer', 'stream'],
    }),
  ],
  build: {
    outDir: 'build',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      // Exclude @axe-core from production bundle
      external: ['@axe-core/react'],
      output: {
        manualChunks(id: string) {
          // Build smaller chunks for @mui, lodash, xterm, recharts
          if (id.includes('node_modules')) {
            if (id.includes('lodash')) {
              return 'vendor-lodash';
            }

            if (id.includes('@mui/material')) {
              return 'vendor-mui';
            }

            if (id.includes('xterm')) {
              return 'vendor-xterm';
            }

            if (id.includes('recharts')) {
              return 'vendor-recharts';
            }
          }
        },
      },
    },
  },
});
