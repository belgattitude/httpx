import { browserslistToEsbuild, defineConfig } from "@httpx/dx/tsdown";

console.log("targets", ...browserslistToEsbuild());

export default defineConfig((_options) => {
  return {
    clean: true,
    dts: { tsconfig: "./tsconfig.build.json" },
    entry: ["src/index.ts"],
    minify: "dce-only",
    platform: "neutral",
    treeshake: true,
    format: {
      esm: {
        target: ["node20", ...browserslistToEsbuild()],
        unbundle: false,
        sourcemap: true,
      },
      cjs: {
        target: ["node20", ...browserslistToEsbuild()],
        unbundle: false,
        sourcemap: false,
      },
    },
  };
});
