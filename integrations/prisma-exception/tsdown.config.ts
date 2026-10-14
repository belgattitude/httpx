import browserslistToEsbuild from "browserslist-to-esbuild";
import { defineConfig } from "tsdown";

export default defineConfig({
  clean: true,
  dts: { tsconfig: "./tsconfig.build.json" },
  entry: ["src/index.ts"],
  minify: true,
  // keep the published file names (.mjs / .cjs, .d.ts / .d.cts)
  outExtensions: ({ format }) =>
    format === "cjs"
      ? { js: ".cjs", dts: ".d.cts" }
      : { js: ".mjs", dts: ".d.ts" },
  platform: "browser",
  sourcemap: true,
  target: ["es2022", ...browserslistToEsbuild()],
  treeshake: true,
  format: ["esm", "cjs"],
  exports: false,
});
