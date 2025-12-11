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
        js: `.${format === 'cjs' ? 'cjs' : 'js'}`,
      };
    },
    platform: 'browser',
    sourcemap: !options.watch,
    splitting: true,
    bundle: true,
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
