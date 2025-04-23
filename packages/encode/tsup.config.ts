import browserslistToEsbuild from 'browserslist-to-esbuild';
import {
  fixExtensionsPlugin,
  fixImportsPlugin,
} from 'esbuild-fix-imports-plugin';
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
  const { entry, platform, bundle, format = ['esm'] } = params;
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
    platform: platform,
    sourcemap: !options.watch,
    splitting: true,
    bundle: bundle,
    target: ['es2022', ...browserslistToEsbuild()],
    treeshake: true,
    tsconfig: './tsconfig.build.json',
    esbuildPlugins: [
      // esbuildPluginFilePathExtensions({ esmExtension: 'mjs' }),
      fixExtensionsPlugin(),
      fixImportsPlugin(),
    ],
  };
};

export default defineConfig((options) => {
  return [
    getStandardOptions(options, {
      entry: ['src/index.nodejs.ts', 'src/base64/*.ts', 'src/cache/*.ts'],
      platform: 'node',
      bundle: false,
      format: ['esm'],
    }),
    getStandardOptions(options, {
      entry: ['src/index.browser.ts', 'src/base64/*.ts', 'src/cache/*.ts'],
      platform: 'node',
      bundle: false,
      format: ['esm'],
    }),
    getStandardOptions(options, {
      entry: ['src/index.purejs.ts', 'src/base64/*.ts', 'src/cache/*.ts'],
      platform: 'neutral',
      bundle: false,
      format: ['esm'],
    }),
    getStandardOptions(options, {
      entry: ['src/index.ts', 'src/base64/*.ts', 'src/cache/*.ts'],
      platform: 'neutral',
      bundle: false,
      format: ['esm'],
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
