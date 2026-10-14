import browserslistToEsbuild from "browserslist-to-esbuild";
import { esbuildPluginFilePathExtensions } from "esbuild-plugin-file-path-extensions";
import { defineConfig } from "tsup";

export default defineConfig((options) => {
  const isWatch = Boolean(options.watch);
  return {
    cjsInterop: false,
    clean: true,
    dts: true,
    // bundle: false,
    entry: ["src/**/*.ts", "!src/**/*.test.ts", "!src/**/*.types.ts"],
    format: ["cjs", "esm"],
    minify: !isWatch,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    outExtension({ format }) {
      return {
        js: `.${format === "cjs" ? "cjs" : "mjs"}`,
      };
    },
    platform: "browser",
    sourcemap: !isWatch,
    // splitting: true,
    target: ["node20", ...browserslistToEsbuild()],
    treeshake: true,
    tsconfig: "./tsconfig.build.json",
    esbuildPlugins: [esbuildPluginFilePathExtensions({ esmExtension: "mjs" })],
  };
});
