import browserslistToEsbuild from 'browserslist-to-esbuild';
import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  return {
    cjsInterop: false,
    clean: true,
    dts: true,
    entry: [
      'src/index.ts',
      'src/experimental/index.ts',
      'src/serializer/index.ts',
    ],
    bundle: true,
    format: ['esm', 'cjs'],
    minify: !options.watch,
    minifyIdentifiers: !options.watch,
    minifySyntax: !options.watch,
    minifyWhitespace: !options.watch,
    outExtension({ format }) {
      return {
        js: `.${format === 'cjs' ? 'cjs' : 'mjs'}`,
      };
    },
    // keepNames: true,
    platform: 'neutral',
    sourcemap: !options.watch,
    splitting: true,
    target: ['es2022', ...browserslistToEsbuild()],
    treeshake: true,
    tsconfig: './tsconfig.build.json',
  };
});
