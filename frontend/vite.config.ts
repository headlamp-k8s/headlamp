import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  build: {
    outDir: 'build',
    commonjsOptions: { transformMixedEsModules: true },
  },
  plugins: [svgr(), react()],
  define: {
    // By default, Vite doesn't include shims for NodeJS
    // necessary for @octokit_core lib to work
    global: {},
    'process.env': {},
  },
  resolve: {
    alias: {
      process: 'process/browser',
      buffer: 'buffer',
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      assert: 'assert',
      http: 'stream-http',
      https: 'https-browserify',
      os: 'os-browserify',
      url: 'url',
      util: 'util',
    },
  },
});
