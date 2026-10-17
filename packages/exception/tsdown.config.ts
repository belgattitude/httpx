import { defineConfig } from "tsdown";

import pkg from "./package.json" with { type: "json" };

const [major] = pkg.version.split(".");

export default defineConfig({
  clean: true,
  // brand symbol shared by all copies of the same major version (src/utils/brand.ts)
  define: { __HTTPX_EXCEPTION_MAJOR__: JSON.stringify(major) },
  dts: { tsconfig: "./tsconfig.build.json" },
  entry: {
    index: "src/index.ts",
    "experimental/index": "src/experimental/index.ts",
    "serializer/index": "src/serializer/index.ts",
  },
  minify: true,
  // keep the published file names (.mjs / .cjs, .d.ts / .d.cts)
  outExtensions: ({ format }) =>
    format === "cjs"
      ? { js: ".cjs", dts: ".d.cts" }
      : { js: ".mjs", dts: ".d.ts" },
  platform: "neutral",
  sourcemap: true,
  // es2022 (not the browserslist targets): oxc lowers class fields for safari 15, and the
  // resulting top-level defineProperty calls on `static STATUS` break tree-shaking
  target: ["node22", "es2022"],
  treeshake: true,
  format: ["esm", "cjs"],
  exports: false,
});
