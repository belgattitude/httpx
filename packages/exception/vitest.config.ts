import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const testFiles = ['./src/**/*.test.{js,ts}', './test/**/*.test.{js,ts}'];

// eslint-disable-next-line import/no-unassigned-import
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
      dir: '../../.cache/vitest/httpx-exception',
    },
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'clover'],
      all: true,
      include: ['src/**/*.{js,jsx,ts,tsx}'],
    },
    deps: {
      /*
      experimentalOptimizer: {
        enabled: false,
      }, */
    },
    include: testFiles,
    // To mimic Jest behaviour regarding mocks.
    // @link https://vitest.dev/config/#clearmocks
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    exclude: [
      '**/node_modules/**',
      'dist/**',
      '**/coverage/**',
      '**/.{idea,git,cache,output,temp}/**',
    ],
  },
});
