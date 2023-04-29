/* eslint-disable sonarjs/no-duplicate-string */

import { createRequire } from 'node:module';
import { babel } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import { minify as swcMinify } from 'rollup-plugin-swc3';
import { globalCachePath } from '../../cache.config.cjs';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const config = {
  distDir: './dist',
  ecmascriptLevel: '2015',
  sourceMap: false, // process.env.NODE_ENV === 'production',
  cache: false,
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  minify: false,
  external: [
    ...Object.keys(pkg?.dependencies ?? {}),
    ...Object.keys(pkg?.peerDependencies ?? {}),
  ],
};

const rollupPlugins = {
  compat: [
    // resolve typescript extensions
    resolve({ extensions: config.extensions }),
    // Bundle with babel (currently only the best size for spread/class transforms)
    babel({
      extensions: config.extensions,
      include: ['src/**/*'],
      babelHelpers: 'bundled',
      skipPreflightCheck: false,
    }),
  ],
  modern: [
    typescript({
      tsconfig: './tsconfig.build.json',
      target: `es${config.ecmascriptLevel}`,
      sourceMap: config.sourceMap,
      cacheDir: config.cache
        ? `${globalCachePath}/rollup-typescript/http-exception`
        : false,
      compilerOptions: {
        target: `es${config.ecmascriptLevel}`,
        incremental: false,
        inlineSourceMap: config.sourceMap,
        sourceMap: config.sourceMap,
        removeComments: false,
      },
    }),
  ],
};

/**
 * @param { 'modern' | 'compat' } type
 * @param { 'cjs' | 'esm' } format
 * @param { boolean } minify
 */
const getDefaultRollupPlugins = (type, format, minify) => {
  return [
    ...(type === 'compat' ? rollupPlugins.compat : rollupPlugins.modern),
    ...(minify
      ? [
          swcMinify({
            module: format === 'esm',
            mangle: true, // Mangling does not reduce size enough, let's keep clean
            ecma: config.ecmascriptLevel,
            compress: {
              drop_console: true,
              drop_debugger: true,
              dead_code: true,
            },
            format: {
              beautify: true,
            },
          }),
        ]
      : []),
  ];
};

export default () => [
  // ESM Compat
  {
    input: ['./src/index.ts', './src/serializer/index.ts'],
    external: config.external,
    plugins: [...getDefaultRollupPlugins('compat', 'esm', config.minify)],
    output: {
      format: 'esm',
      preserveModules: true, // Will allow maximum tree-shakeability by bundlers such as webpack
      dir: `${config.distDir}/esm`,
      entryFileNames: '[name].js',
      sourcemap: config.sourceMap,
    },
  },
  // ESM Modern
  /*
  {
    input: ['./src/index.ts'],
    external: config.external,
    plugins: [...getDefaultRollupPlugins('modern', 'esm', config.minify)],
    output: {
      format: 'esm',
      preserveModules: true, // Will allow maximum tree-shakeability by bundlers such as webpack
      dir: `${config.distDir}/modern/esm`,
      entryFileNames: '[name].js',
      sourcemap: config.sourceMap,
    },
  }, */
  // CJS compat
  {
    input: ['./src/index.ts', './src/serializer/index.ts'],
    external: config.external,
    plugins: [...getDefaultRollupPlugins('compat', 'cjs', config.minify)],
    output: {
      preserveModules: true,
      format: 'cjs',
      dir: `${config.distDir}/cjs`,
      entryFileNames: '[name].cjs',
      sourcemap: config.sourceMap,
    },
  },

  // Typings
  {
    input: './src/index.ts',
    output: {
      file: `${config.distDir}/types/index.d.ts`,
      format: 'es',
    },
    external: config.external,
    plugins: [
      dts({
        compilerOptions: {
          tsBuildInfoFile: './tsconfig.tsbuildinfo.dts',
        },
      }),
    ],
  },
  {
    input: './src/serializer/index.ts',
    output: {
      file: `${config.distDir}/types/serializer/index.d.ts`,
      format: 'es',
    },
    external: config.external,
    plugins: [
      dts({
        compilerOptions: {
          tsBuildInfoFile: './tsconfig.tsbuildinfo.dts',
        },
      }),
    ],
  },
];
