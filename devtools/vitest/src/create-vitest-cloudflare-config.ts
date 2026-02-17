import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';
import type { UserConfig } from 'vite';

import {
  getVitestBaseConfig,
  type VitestBaseConfigParams,
} from './get-vitest-base-config.ts';

type Params = VitestBaseConfigParams;

export const createVitestCloudflareConfig = (params?: Params) => {
  const baseConfig = getVitestBaseConfig(params);
  return defineWorkersConfig({
    ...getVitestBaseConfig(params),
    test: {
      ...baseConfig.test,
      poolOptions: {
        workers: {
          wrangler: {
            configPath: '../../devtools/vitest/wrangler.toml',
          },
        },
      },
    },
  }) as unknown as UserConfig;
};
