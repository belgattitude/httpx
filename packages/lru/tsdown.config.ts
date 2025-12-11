import browserslistToEsbuild from 'browserslist-to-esbuild';
import { defineConfig } from 'tsdown';

console.log('targets', ...browserslistToEsbuild());

export default defineConfig((options) => {
  return {
    cjsDefault: false,
    clean: true,
    dts: true,
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    minify: !options.watch,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    platform: 'neutral',
    bundle: true,
    sourcemap: !options.watch,
    splitting: true,
    target: [
      'node20',
      'chrome98',
      'edge100',
      'firefox98',
      'safari16',
      'ios16',
      'opera100',
    ],
    treeshake: true,
    tsconfig: './tsconfig.build.json',
  };
});
