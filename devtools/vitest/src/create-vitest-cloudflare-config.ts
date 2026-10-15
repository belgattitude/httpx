import path from "node:path";

import { cloudflareTest } from "@cloudflare/vitest-plugin";

import {
  getVitestBaseConfig,
  type VitestBaseConfigParams,
} from "./get-vitest-base-config.ts";

type Params = VitestBaseConfigParams & {
  wranglerConfigPath?: string;
};

const __dirname = import.meta.dirname;

const defaultWranglerConfigPath = path.resolve(
  __dirname,
  "..",
  "wrangler.toml"
);

export const createVitestCloudflareConfig = (params?: Params) => {
  const { wranglerConfigPath = defaultWranglerConfigPath, ...restParams } =
    params ?? {};
  const baseConfig = getVitestBaseConfig(restParams);
  return {
    ...baseConfig,
    test: {
      ...baseConfig.test,
      // workerd can't read vitest's persistent module cache (stored in the monorepo root node_modules)
      fsModuleCache: false,
    },
    plugins: [
      ...(baseConfig.plugins ?? []),
      cloudflareTest({
        wrangler: { configPath: wranglerConfigPath },
      }),
    ],
  };
  // }) as unknown as UserConfig;
};
