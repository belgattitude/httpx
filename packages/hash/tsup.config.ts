import browserslistToEsbuild from 'browserslist-to-esbuild';
import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  return {
    cjsInterop: false,
    clean: true,
    dts: true,
    entry: ['src/index.ts', 'src/xxhash-wasm/index.ts'],
    format: 'esm',
    minify: !options.watch,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    platform: 'browser',
    sourcemap: !options.watch,
    splitting: true,
    bundle: true,
    target: ['node20', ...browserslistToEsbuild()],
    // target: ['es2022'],
    treeshake: true,
    tsconfig: './tsconfig.build.json',
  };
});
