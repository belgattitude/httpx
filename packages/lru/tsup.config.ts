import browserslistToEsbuild from 'browserslist-to-esbuild';
import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  return {
    cjsInterop: false,
    clean: true,
    dts: true,
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    minify: !options.watch,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    outExtension({ format }) {
      return {
        js: `.${format === 'cjs' ? 'cjs' : 'mjs'}`,
      };
    },
    platform: 'browser',
    sourcemap: !options.watch,
    splitting: true,
    bundle: true,
    target: ['node20', ...browserslistToEsbuild()],
    // target: ['es2022'],
    treeshake: true,
    tsconfig: './tsconfig.build.json',
  };
});
