import path from "node:path";
import { fileURLToPath } from "node:url";

import codspeedPlugin from "@codspeed/vitest-plugin";
import react from "@vitejs/plugin-react";
import type { ViteUserConfig } from "vitest/config";

import { getMonorepoCacheDir } from "../cache/monorepo-cache-dir.ts";
import { dxConfig } from "../dx-config.ts";

const sourceConditions = [...dxConfig.customConditions, "import", "default"];

const testingLibrarySetupFile = fileURLToPath(
  new URL("setup/testing-library.ts", import.meta.url)
);

export type CreateVitestConfigOptions = {
  /**
   * Add the `@vitejs/plugin-react` plugin and run the tests in the `happy-dom`
   * environment.
   * @default false
   */
  react?: boolean;
  /**
   * Add the `@testing-library/jest-dom` matchers (`toBeInTheDocument`...) to
   * `expect` with a setup file.
   * @default false
   */
  testingLibrary?: boolean;
  /**
   * Add the `@codspeed/vitest-plugin` plugin (benchmarks).
   * @default process.env.CODSPEED === "1"
   */
  codspeed?: boolean;
  /**
   * Directory of the vite (`cacheDir`) and vitest (`fsModuleCachePath`) caches,
   * `false` to keep the vite and vitest defaults.
   * @default `<monorepo root>/.cache/vitest/<package path>` (from the current working directory)
   */
  cache?: string | false;
};

/**
 * vitest base: workspace packages resolved from their sources
 * (`dxConfig.customConditions`), node (or happy-dom for react)
 * environment and v8 coverage of `src`.
 */
export const createVitestConfig = (
  options: CreateVitestConfigOptions = {}
): ViteUserConfig => {
  const {
    react: withReact = false,
    testingLibrary = false,
    codspeed = process.env.CODSPEED === "1",
    cache = getMonorepoCacheDir("vitest"),
  } = options;
  const cacheDir = cache === false ? undefined : cache;
  return {
    ...(cacheDir === undefined
      ? {}
      : { cacheDir: path.join(cacheDir, "vite") }),
    plugins: [
      ...(withReact ? [react()] : []),
      ...(codspeed ? [codspeedPlugin()] : []),
    ],
    resolve: {
      conditions: [...dxConfig.customConditions],
    },
    ssr: {
      resolve: {
        conditions: sourceConditions,
      },
    },
    environments: {
      // Global setup files run in vitest's own environment
      __vitest__: {
        resolve: {
          conditions: sourceConditions,
        },
      },
    },
    test: {
      environment: withReact ? "happy-dom" : "node",
      ...(testingLibrary ? { setupFiles: [testingLibrarySetupFile] } : {}),
      // Not the shared `node_modules/.vitest-cache` of the workspace root: it is
      // cleared when the lockfile changes, which fails when the packages run
      // their tests in parallel (ENOTEMPTY)
      ...(cacheDir === undefined
        ? {}
        : { fsModuleCachePath: path.join(cacheDir, "modules") }),
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/coverage/**",
        "**/.{idea,git,cache,output,temp}/**",
      ],
      coverage: {
        include: ["src/**/*.{js,jsx,ts,tsx}"],
        provider: "v8",
        reporter: ["text"],
      },
    },
  };
};
