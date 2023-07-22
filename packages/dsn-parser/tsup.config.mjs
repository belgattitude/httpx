import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  return {
    entry: ['src/index.ts'],
    splitting: true,
    clean: true,
    dts: true,
    format: ['esm', 'cjs'],
    platform: 'browser',
    target: ['es2017', 'chrome70', 'edge18', 'firefox70', 'node14'],
    tsconfig: './tsconfig.build.json',
    sourcemap: !options.watch,
    minify: !options.watch,
  };
});
