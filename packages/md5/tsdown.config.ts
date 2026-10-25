import { browserslistToEsbuild, defineConfig } from "@httpx/dx/tsdown";

console.log("targets", ...browserslistToEsbuild());

export default defineConfig((_options) => [
  {
    clean: true,
    dts: { tsconfig: "./tsconfig.build.json" },
    entry: ["src/index.ts"],
    minify: "dce-only",
    fixedExtension: true,
    platform: "neutral",
    treeshake: true,
    format: {
      esm: {
        target: ["es2022", ...browserslistToEsbuild()],
        unbundle: false,
        sourcemap: true,
      },
    },
  },
  {
    clean: true,
    dts: { tsconfig: "./tsconfig.build.json" },
    entry: ["src/ecmascript/index.ts"],
    outDir: "dist/ecmascript",
    minify: "dce-only",
    fixedExtension: true,
    platform: "neutral",
    treeshake: true,
    format: {
      esm: {
        target: ["es2022", ...browserslistToEsbuild()],
        unbundle: false,
        sourcemap: true,
      },
    },
  },
  {
    clean: true,
    dts: { tsconfig: "./tsconfig.build.json" },
    entry: ["src/nodejs/index.ts"],
    outDir: "dist/nodejs",
    minify: "dce-only",
    platform: "node",
    fixedExtension: true,
    treeshake: true,
    format: {
      esm: {
        target: ["node20"],
        unbundle: false,
        sourcemap: true,
      },
    },
  },
]);
