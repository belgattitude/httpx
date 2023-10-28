import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const testFiles = ['./src/**/*.test.{js,ts}', './test/**/*.test.{js,ts}'];

// eslint-disable-next-line import/no-unassigned-import
import 'error-cause-polyfill/auto';

export default defineConfig({
  esbuild: {
    target: ['node14'],
  },
  plugins: [tsconfigPaths()],
  test: {
    cache: {
      dir: '../../.cache/vitest/httpx-exception',
    },
    // @link https://vitest.dev/config/#clearmocks
    clearMocks: true,
    coverage: {
      all: true,
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      provider: 'istanbul',
      reporter: ['text', 'json', 'clover'],
    },
    deps: {
      /*
      experimentalOptimizer: {
        enabled: false,
      }, */
    },
    environment: 'node',
    exclude: [
      '**/node_modules/**',
      'dist/**',
      '**/coverage/**',
      '**/.{idea,git,cache,output,temp}/**',
    ],
    globals: true,
    include: testFiles,
    // To mimic Jest behaviour regarding mocks.
    mockReset: true,
    passWithNoTests: false,
    restoreMocks: true,
    setupFiles: './test/_setup/setupVitest.ts',
  },
});
