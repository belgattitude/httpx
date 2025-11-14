import { playwright } from '@vitest/browser-playwright';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const testFiles = ['./src/**/*.test.{js,ts}', './test/**/*.test.{js,ts}'];

export default defineConfig({
  esbuild: {
    target: ['node20'],
  },
  plugins: [tsconfigPaths()],
  cacheDir: '../../.cache/vite/httpx-exception',
  test: {
    browser: {
      provider: playwright({
        launchOptions: {
          slowMo: 100,
        },
      }),
      enabled: false,
      // at least one instance is required
      instances: [{ browser: 'chromium' }],
    },
    // @link https://vitest.dev/config/#clearmocks
    clearMocks: true,
    coverage: {
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      provider: 'istanbul',
      reporter: ['text', 'json', 'clover'],
    },
    deps: {
      optimizer: {
        web: {
          enabled: true,
        },
        ssr: { enabled: true },
      },
    },
    typecheck: {
      enabled: false,
    },
    // threads is good, vmThreads is faster (perf++) but comes with limitations
    // @link https://vitest.dev/config/#vmthreads
    pool: 'forks',
    environment: 'node',
    exclude: [
      '**/node_modules/**',
      'dist/**',
      '**/coverage/**',
      '**/.{idea,git,cache,output,temp}/**',
    ],
    // By default, vitest does not provide global APIs for explicitness. If you prefer to use the APIs globally like Jest,
    // you can pass the --globals option to CLI or add globals: true in the config.
    // https://vitest.dev/config/#globals
    globals: false,
    include: testFiles,
    // To mimic Jest behaviour regarding mocks.
    mockReset: true,
    passWithNoTests: true,
    restoreMocks: true,
  },
});
