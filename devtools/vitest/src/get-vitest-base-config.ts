import { createVitestConfig, mergeConfig } from "@httpx/dx/vitest";
import { playwright } from "@vitest/browser-playwright";
import type { ViteUserConfig } from "vitest/config";

import type { RequiredOptionals } from "./utils/type-utils.ts";

export type VitestBaseConfigParams = {
  testFiles?: string[];
};

const getDefaultParams = () => {
  const defaultParams = {
    testFiles: ["./src/**/*.test.{js,ts,tsx}", "./test/**/*.test.{js,ts,tsx}"],
  } as const satisfies RequiredOptionals<VitestBaseConfigParams>;
  return defaultParams;
};

/**
 * The @httpx/dx vitest config (source condition, node environment, v8
 * coverage, codspeed plugin when CODSPEED=1, per package caches) plus what
 * the httpx packages add: their test files, the vitest globals (describe,
 * it, expect... without import), the browser provider (enabled by
 * `--browser`) and the coverage reports uploaded to codecov.
 */
export const getVitestBaseConfig = (
  params?: VitestBaseConfigParams
): ViteUserConfig => {
  const { testFiles } = {
    ...getDefaultParams(),
    ...params,
  };

  return mergeConfig(createVitestConfig(), {
    test: {
      browser: {
        provider: playwright({
          launchOptions: {
            slowMo: 100,
          },
        }),
        enabled: false,
        // at least one instance is required
        instances: [{ browser: "chromium" }],
      },
      coverage: {
        exclude: ["**/*.bench.ts"],
        // concatenated to the dx `text` reporter, read by codecov
        reporter: ["json", "clover"],
      },
      include: testFiles,
      globals: true,
    },
  } satisfies ViteUserConfig);
};
