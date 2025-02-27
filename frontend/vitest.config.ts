/// <reference types="vitest" />
import { defineConfig, mergeConfig } from 'vitest/config';
import { coverageConfigDefaults } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      env: {
        UNDER_TEST: 'true',
      },
      alias: [
        {
          find: /^monaco-editor$/,
          replacement: __dirname + '/node_modules/monaco-editor/esm/vs/editor/editor.api',
        },
      ],
      fakeTimers: {
        toFake: ['Date', 'setTimeout', 'clearTimeout'],
      },
      coverage: {
        provider: 'istanbul',
        reporter: [['text', { maxCols: 200 }], ['html']],
        exclude: [
          ...coverageConfigDefaults.exclude,
          'node_modules/**',
          'build/**',
          'src/**/*.stories*.{js,jsx,ts,tsx}',
        ],
        include: ['src/**/*.{js,jsx,ts,tsx}'],
      },
      restoreMocks: false,
      setupFiles: ['./src/setupTests.ts'],
    },
  })
);
