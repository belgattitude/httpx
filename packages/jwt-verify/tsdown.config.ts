import browserslistToEsbuild from 'browserslist-to-esbuild';
import { defineConfig } from 'tsdown';

console.log('targets', ...browserslistToEsbuild());

export default defineConfig((_options) => {
  return {
    clean: true,
    dts: true,
    entry: ['src/index.ts'],
    minify: 'dce-only',
    platform: 'neutral',
    treeshake: true,
    format: {
      esm: {
        target: ['node20', ...browserslistToEsbuild()],
        unbundle: false,
        sourcemap: true,
      },
    },
  };
});
