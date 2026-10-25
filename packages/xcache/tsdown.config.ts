import { browserslistToEsbuild, defineConfig } from "@httpx/dx/tsdown";

console.log("targets", ...browserslistToEsbuild());

export default defineConfig((_options) => {
  return {
    clean: true,
    dts: { tsconfig: "./tsconfig.build.json" },
    entry: {
      index: "src/index.ts",
      "hono/index": "src/hono/index.ts",
      superjson: "src/superjson.ts",
      devalue: "src/devalue.ts",
      "cbor-x": "src/cbor-x.ts",
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
