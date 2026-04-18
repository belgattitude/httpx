import browserslistToEsbuild from 'browserslist-to-esbuild';
import { defineConfig } from 'tsdown';

console.log('targets', ...browserslistToEsbuild());

export default defineConfig((_options) => {
  return {
    clean: true,
    dts: true,
    entry: [
      'src/index.ts',
      'src/cache/global-cache.ts',
      'src/index.browser.ts',
      'src/index.nodejs.ts',
      'src/index.purejs.ts',
      'src/base64/base64.purejs.ts',
      'src/base64/base64.nodejs.ts',
      'src/base64/base64.browser.ts',
    ],
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
