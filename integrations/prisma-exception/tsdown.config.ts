import { browserslistToEsbuild, defineConfig } from "@httpx/dx/tsdown";

export default defineConfig({
  clean: true,
  dts: { tsconfig: "./tsconfig.build.json" },
  entry: ["src/index.ts"],
  minify: true,
  platform: "browser",
  sourcemap: true,
  target: ["es2022", ...browserslistToEsbuild()],
  treeshake: true,
  format: ["esm"],
  exports: false,
});
