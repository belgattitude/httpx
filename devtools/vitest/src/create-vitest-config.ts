import { defineConfig } from 'vitest/config';

import {
  getVitestBaseConfig,
  type VitestBaseConfigParams,
} from './get-vitest-base-config.ts';

type Params = VitestBaseConfigParams;

export const createVitestConfig = (params?: Params) => {
  return defineConfig(getVitestBaseConfig(params));
};
