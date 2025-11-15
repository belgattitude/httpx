import codspeedPlugin from '@codspeed/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const testFiles = ['./src/**/*.test.{js,ts}', './test/**/*.test.{js,ts}'];

const isCodeSpeedEnabled = process.env?.CODSPEED === '1';
const cspeed = isCodeSpeedEnabled ? codspeedPlugin() : undefined;

export default defineConfig({
  esbuild: {
    target: ['node20'],
  },
  plugins: [tsconfigPaths(), ...[cspeed].filter(Boolean)],
  cacheDir: '../../.cache/vite/encode',
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
    typecheck: {
      enabled: false,
    },
    benchmark: {
      reporters: ['default'],
      outputJson: './bench/output/benchmark-results.json',
    },
    pool: 'forks',
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
