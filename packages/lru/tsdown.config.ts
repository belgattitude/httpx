import { defineConfig } from 'tsdown';

export default defineConfig((options) => {
  return {
    cjsDefault: false,
    clean: true,
    dts: true,
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    minify: !options.watch,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    platform: 'neutral',
    sourcemap: !options.watch,
    splitting: true,
    target: ['es2024'],
    // target: ['es2022'],
    treeshake: true,
    tsconfig: './tsconfig.build.json',
  };
});
