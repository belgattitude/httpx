import { oxlintDefaultConfig } from "@httpx/dx";
import { defineConfig } from "@httpx/dx/oxlint";

export default defineConfig({
  extends: [oxlintDefaultConfig],
  ignorePatterns: ["**/_release", "**/docs"],
  overrides: [
    {
      // Pure js base64 codec: bitwise operations on byte chunks are the algorithm
      files: ["src/base64/base64.purejs.ts"],
      rules: {
        "no-bitwise": "off",
      },
    },
  ],
});
