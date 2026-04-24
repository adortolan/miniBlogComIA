import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/test/setup.js',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov', 'json-summary'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.spec.{js,jsx}',
        '**/*.test.{js,jsx}',
        '**/dist/',
        '**/.{eslint,prettier}rc.{js,cjs}',
        'vite.config.js',
        'vitest.config.js',
        'tailwind.config.js',
        'postcss.config.js',
      ],
      include: ['src/**/*.{js,jsx}'],
      all: true,
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
