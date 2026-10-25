import { browserslistToEsbuild, defineConfig } from "@httpx/dx/tsdown";

console.log("targets", ...browserslistToEsbuild());

export default defineConfig((_options) => {
  return {
    clean: true,
    dts: { tsconfig: "./tsconfig.build.json" },
    entry: [
      "src/index.ts",
      "src/cache/__httpx_encode_base64_cache.ts",
      "src/index.browser.ts",
      "src/index.node20.ts",
      "src/index.uint8.ts",
      "src/index.default.ts",
      "src/base64/base64.purejs.ts",
      "src/base64/base64.node20.ts",
      "src/base64/base64.atob.ts",
      "src/base64/base64.uint8array.ts",
    ],
    minify: "dce-only",
    platform: "neutral",
    treeshake: true,
    format: {
      esm: {
        target: ["node22", ...browserslistToEsbuild()],
        sourcemap: true,
      },
    },
  };
});
