import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const testFiles = ['./src/**/*.test.{js,ts}'];

import 'error-cause-polyfill/auto';

export default defineConfig({
  plugins: [tsconfigPaths()],
  esbuild: {
    target: ['node14'],
  },
  test: {
    globals: true,
    environment: 'node',
    passWithNoTests: false,
    setupFiles: './test/_setup/setupVitest.ts',
    cache: {
      dir: '../../.cache/vitest/http-exception',
    },
    coverage: {
      provider: 'istanbul',
      reporter: ['json', 'clover'],
      extension: ['js', 'jsx', 'ts', 'tsx'],
    },
    include: testFiles,
    exclude: [
      '**/node_modules/**',
      'dist/**',
      '**/coverage/**',
      '**/.{idea,git,cache,output,temp}/**',
    ],
  },
});
