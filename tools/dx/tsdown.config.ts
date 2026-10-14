import browserslistToEsbuild from "browserslist-to-esbuild";
import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/index.ts"],
  dts: true,
  clean: true,
  attw: {
    profile: "esm-only",
    level: "error",
  },
  publint: {
    level: "error",
  },
  format: {
    esm: {
      target: ["node22", ...browserslistToEsbuild()],
    },
  },
  platform: "node",
  treeshake: true,
  exports: false,
  minify: "dce-only",
  unbundle: false,
});
