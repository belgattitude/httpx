import { getVitestBaseConfig } from '@httpx/devtools-vitest';
import { defineConfig } from 'vitest/config';

export default defineConfig(
  getVitestBaseConfig({
    useCloudflare: false,
  })
);
