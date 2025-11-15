import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';
import tsconfigPaths from 'vite-tsconfig-paths';

const testFiles = ['./src/**/*.test.{js,ts}', './test/**/*.test.{js,ts}'];

export default defineWorkersConfig({
  esbuild: {
    target: ['es2022'],
  },
  plugins: [tsconfigPaths()],
  cacheDir: '../../.cache/vite/httpx-treeu',
  test: {
    // @link https://vitest.dev/config/#clearmocks
    clearMocks: true,
    poolOptions: {
      workers: {
        wrangler: {
          configPath: '../../devtools/vitest/wrangler.toml',
        },
      },
    },
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
    passWithNoTests: true,
    restoreMocks: true,
  },
});
