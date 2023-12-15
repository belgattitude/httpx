import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const testFiles = ['./src/**/*.test.{js,ts}', './test/**/*.test.{js,ts}'];

export default defineConfig({
  esbuild: {
    target: ['node18'],
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
      optimizer: {
        web: {
          enabled: false,
        },
        ssr: { enabled: true },
      },
    },
    typecheck: {
      enabled: false,
    },
    pool: 'threads',
    poolOptions: {
      vmThreads: {
        // useAtomics: true,
      },
      threads: {
        minThreads: 1,
        maxThreads: 16,
        useAtomics: true, // perf+ if true
        isolate: true, // perf+++ if false
      },
    },
    environment: 'node',
    exclude: [
      '**/node_modules/**',
      'dist/**',
      '**/coverage/**',
      '**/.{idea,git,cache,output,temp}/**',
    ],
    globals: false,
    include: testFiles,
    // To mimic Jest behaviour regarding mocks.
    mockReset: true,
    passWithNoTests: false,
    // To mimic Jest behaviour regarding mocks.
    restoreMocks: true,
  },
});
