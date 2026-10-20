import browserslistToEsbuild from "browserslist-to-esbuild";
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
  minify: "dce-only",
  platform: "neutral",
  // targets must support class fields natively (safari >= 16): lowered class fields
  // become top-level defineProperty calls on `static STATUS` that break tree-shaking
  // (checked by scripts/check-treeshake.mjs)
  target: ["node22", ...browserslistToEsbuild()],
  treeshake: true,
  format: ["esm"],
  exports: false,
});
