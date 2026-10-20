import browserslistToEsbuild from "browserslist-to-esbuild";
import { defineConfig } from "tsdown";

console.log("targets", ...browserslistToEsbuild());

export default defineConfig({
  clean: true,
  dts: { tsconfig: "./tsconfig.build.json" },
  entry: ["src/index.ts"],
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
});
