import {
  defineConfig,
  mergeConfig,
  vitestDefaultConfig,
} from "./src/vitest.ts";

export default mergeConfig(
  vitestDefaultConfig,
  defineConfig({
    test: {
      include: ["./src/**/*.test.ts"],
      passWithNoTests: true,
    },
  })
);
