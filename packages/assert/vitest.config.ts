import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const testFiles = ['./src/**/*.test.{js,ts}', './test/**/*.test.{js,ts}'];

export default defineConfig({
  esbuild: {
    target: ['node18'],
  },
  plugins: [tsconfigPaths()],
  cacheDir: '../../.cache/vite/httpx-assert',
  test: {
    browser: {
      provider: 'playwright',
      name: 'chromium',
      headless: true,
    },
    // @link https://vitest.dev/config/#clearmocks
    clearMocks: true,
    coverage: {
      all: true,
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: ['**/*.bench.ts'],
      provider: 'istanbul',
      reporter: ['text', 'json', 'clover'],
    },
    typecheck: {
      enabled: false,
    },
    benchmark: {
      reporters: ['default'],
      outputJson: './bench/output/benchmark-results.json',
    },
    pool: 'forks',
    poolOptions: {
      vmThreads: {
        // useAtomics: true,
      },
      threads: {
        // minThreads: 1,
        // maxThreads: 16,
        useAtomics: true, // perf+
        isolate: false, // perf+++
      },
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
  },
});
