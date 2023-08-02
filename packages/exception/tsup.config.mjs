import browserslistToEsbuild from 'browserslist-to-esbuild';
import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  return {
    entry: ['src/index.ts', 'src/serializer/index.ts'],
    splitting: true,
    treeshake: true,
    clean: true,
    dts: true,
    format: ['esm', 'cjs'],
    minifySyntax: false,
    minifyWhitespace: false,
    minifyIdentifiers: false,
    cjsInterop: true,
    outExtension({ format }) {
      return {
        js: `.${format === 'cjs' ? 'cjs' : 'mjs'}`,
      };
    },
    platform: 'browser',
    target: ['es2018', ...browserslistToEsbuild()],
    tsconfig: './tsconfig.build.json',
    sourcemap: !options.watch,
    minify: !options.watch,
  };
});
