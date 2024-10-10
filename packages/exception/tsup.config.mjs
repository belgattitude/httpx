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
    minify: false,
    minifyIdentifiers: false,
    minifySyntax: false,
    minifyWhitespace: false,
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
    outDir: './dist-tsup',
    tsconfig: './tsconfig.build.json',
  };
});
