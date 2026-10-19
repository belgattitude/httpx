import browserslistToEsbuild from "browserslist-to-esbuild";
import { defineConfig } from "tsdown";

console.log("targets", ...browserslistToEsbuild());

export default defineConfig((_options) => {
  return {
    clean: true,
    dts: { tsconfig: "./tsconfig.build.json" },
    entry: {
      index: "src/index.ts",
      "hono/index": "src/hono/index.ts",
    },
    minify: "dce-only",
    platform: "neutral",
    treeshake: true,
    format: {
      esm: {
        target: ["node22", ...browserslistToEsbuild()],
        unbundle: false,
        sourcemap: true,
      },
    },
  };
});
