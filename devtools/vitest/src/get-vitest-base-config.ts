import path from 'node:path';

import { cloudflareTest } from '@cloudflare/vitest-pool-workers';
import codspeedPlugin from '@codspeed/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import tsconfigPaths from 'vite-tsconfig-paths';
import type { ViteUserConfigExport } from 'vitest/config';

import { cloudflareConfig } from './cloudflare.config.ts';
import { getPackageNameFromCwd } from './get-package-name-from-cwd.ts';
import { monorepoConfig } from './monorepo.config.ts';
import type { RequiredOptionals } from './utils/type-utils.ts';

type Params = {
  packageName?: string;
  testFiles?: string[];
  useCloudflare?: boolean;
};

const getDefaultParams = () => {
  const defaultParams = {
    packageName: getPackageNameFromCwd(),
    testFiles: ['./src/**/*.test.{js,ts,tsx}', './test/**/*.test.{js,ts,tsx}'],
    useCloudflare: false,
  } as const satisfies RequiredOptionals<Params>;
  return defaultParams;
};

export const getVitestBaseConfig = (params: Params) => {
  const isCodeSpeedEnabled = process.env?.CODSPEED === '1';

  const { packageName, testFiles, useCloudflare } = {
    ...getDefaultParams(),
    ...params,
  };
  const cacheDir = path.join(monorepoConfig.root, '.cache', packageName);

  const config = {
    cacheDir: cacheDir,
    esbuild: {
      target: ['node20'],
    },
    plugins: [
      tsconfigPaths({
        // projectDiscovery: 'lazy',
        // root: process.cwd(),
        // logFile: '/tmp/test.log',
      }),
      useCloudflare
        ? cloudflareTest({
            miniflare: {
              ...cloudflareConfig.miniflare,
              // compatibilityFlags: ['nodejs_compat'],
            },
          })
        : null,
      isCodeSpeedEnabled ? codspeedPlugin() : undefined,
    ].filter(Boolean),
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
      exclude: [
        '**/node_modules/**',
        'dist/**',
        'build/**',
        '**/coverage/**',
        '**/.{idea,next,git,cache,output,temp}/**',
      ],
      globals: true,
      include: testFiles,
      // To mimic Jest behaviour regarding mocks.
      mockReset: true,
      passWithNoTests: false,
      restoreMocks: true,
    },
  } satisfies ViteUserConfigExport;
  return config;
};
