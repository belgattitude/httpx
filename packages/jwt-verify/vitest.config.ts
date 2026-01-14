import codspeedPlugin from '@codspeed/vitest-plugin';
import { getVitestBaseConfig } from '@httpx/devtools-vitest';
import { defineConfig } from 'vitest/config';

const testFiles = ['./src/**/*.test.{js,ts}', './test/**/*.test.{js,ts}'];

const isCodeSpeedEnabled = process.env?.CODSPEED === '1';
const cspeed = isCodeSpeedEnabled ? codspeedPlugin() : undefined;

export default defineConfig(
  getVitestBaseConfig({
    useCloudflare: false,
  })
);
