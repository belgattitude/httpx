import browserslistToEsbuild from 'browserslist-to-esbuild';
import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  return {
    entry: ['src/index.ts'],
    splitting: true,
    treeshake: true,
    clean: true,
    dts: true,
    format: ['esm', 'cjs'],
    outExtension({ format }) {
      return {
        js: `.${format === 'cjs' ? 'cjs' : 'mjs'}`,
      };
    },
    platform: 'browser',
    minifySyntax: true,
    minifyWhitespace: true,
    minifyIdentifiers: true,
    target: ['es2022', ...browserslistToEsbuild()],
    tsconfig: './tsconfig.build.json',
    sourcemap: !options.watch,
    minify: !options.watch,
  };
});
