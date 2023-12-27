import browserslistToEsbuild from 'browserslist-to-esbuild';
import { esbuildPluginFilePathExtensions } from 'esbuild-plugin-file-path-extensions';
import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  return {
    cjsInterop: false,
    clean: true,
    dts: true,
    // bundle: false,
    entry: ['src/**/*.ts', '!src/**/*.test.ts'],
    format: ['cjs', 'esm'],
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
    // splitting: true,
    target: ['es2021', ...browserslistToEsbuild()],
    treeshake: true,
    tsconfig: './tsconfig.build.json',
    esbuildPlugins: [esbuildPluginFilePathExtensions({ esmExtension: 'mjs' })],
  };
});
