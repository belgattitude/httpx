import { defineConfig } from 'tsdown';

export default defineConfig((_options) => {
  return {
    clean: true,
    dts: true,
    entry: ['src/index.ts'],
    minify: 'dce-only',
    platform: 'node',
    treeshake: true,
    format: {
      esm: {
        target: ['node20'],
        unbundle: false,
      },
    },
  };
});
