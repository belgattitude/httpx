import browserslistToEsbuild from 'browserslist-to-esbuild';
import { esbuildPluginFilePathExtensions } from 'esbuild-plugin-file-path-extensions';
import { defineConfig, type Options } from 'tsup';

const getStandardOptions = (
  options: Options,
  params: {
    entry: string[];
    platform: 'node' | 'browser' | 'neutral';
    bundle: boolean;
    format?: ('cjs' | 'esm')[];
  }
): Options => {
  const { entry, platform, bundle, format = ['esm', 'cjs'] } = params;
  return {
    cjsInterop: true,
    clean: true,
    dts: true,
    entry: entry,
    format: format,
    minify: !options.watch,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    outExtension({ format }) {
      return {
        js: `.${format === 'cjs' ? 'cjs' : 'mjs'}`,
      };
    },
    platform: platform,
    sourcemap: !options.watch,
    splitting: true,
    bundle: bundle,
    target: ['es2022', ...browserslistToEsbuild()],
    treeshake: true,
    tsconfig: './tsconfig.build.json',
    esbuildPlugins: [esbuildPluginFilePathExtensions({ esmExtension: 'mjs' })],
  };
};

export default defineConfig((options) => {
  return [
    getStandardOptions(options, {
      entry: ['src/index.ts', 'src/base64/*.ts', 'src/cache/*.ts'],
      platform: 'neutral',
      bundle: true,
      format: ['esm'],
    }),
    getStandardOptions(options, {
      entry: ['src/index.cts', 'src/base64/*.ts', 'src/cache/*.ts'],
      platform: 'neutral',
      bundle: true,
      format: ['cjs'],
    }),
    /*
    getStandardOptions(options, {
      entry: ['src/base64/base64.browser.ts'],
      platform: 'browser',
      bundle: true,
    }),
    getStandardOptions(options, {
      entry: ['src/base64/base64.nodejs.ts'],
      platform: 'node',
      bundle: true,
    }),
    getStandardOptions(options, {
      entry: ['src/base64/base64.purejs.ts'],
      platform: 'neutral',
      bundle: true,
    }), */
  ];
});
