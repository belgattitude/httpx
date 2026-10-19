import { oxlintDefaultConfig } from "@httpx/dx";
import { defineConfig } from "@httpx/dx/oxlint";

export default defineConfig({
  extends: [oxlintDefaultConfig],
  ignorePatterns: ["**/_release", "**/docs"],
  overrides: [
    {
      // FNV-1a hash: 32-bit bitwise math on utf-16 code units is the algorithm
      files: ["src/hono/http-utils.ts"],
      rules: {
        "no-bitwise": "off",
        "unicorn/prefer-code-point": "off",
      },
    },
  ],
});
