import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const testFiles = ['./src/**/*.test.{js,ts}', './test/**/*.test.{js,ts}'];

export default defineConfig({
  esbuild: {
    target: ['node20'],
  },
  plugins: [tsconfigPaths()],
  test: {
    pool: 'forks',
    deps: {
      optimizer: {
        web: {
          enabled: false,
        },
        ssr: {
          enabled: false,
        },
      },
    },
    benchmark: {
      reporters: ['default'],
      outputJson: './bench/benchmark-results.json',
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
  },
});
