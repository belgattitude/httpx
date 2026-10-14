import browserslistToEsbuild from "browserslist-to-esbuild";
import { defineConfig } from "tsup";

export default defineConfig((options) => {
  const isWatch = Boolean(options.watch);
  return {
    cjsInterop: false,
    clean: true,
    dts: true,
    entry: [
      "src/index.ts",
      "src/experimental/index.ts",
      "src/serializer/index.ts",
    ],
    bundle: true,
    format: ["esm", "cjs"],
    minify: !isWatch,
    minifyIdentifiers: !isWatch,
    minifySyntax: !isWatch,
    minifyWhitespace: !isWatch,
    outExtension({ format }) {
      return {
        js: `.${format === "cjs" ? "cjs" : "mjs"}`,
      };
    },
    // keepNames: true,
    platform: "neutral",
    sourcemap: !isWatch,
    splitting: true,
    target: ["node20", ...browserslistToEsbuild()],
    treeshake: true,
    tsconfig: "./tsconfig.build.json",
  };
});
