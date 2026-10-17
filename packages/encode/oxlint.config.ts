import { oxlintDefaultConfig } from "@httpx/dx";
import { defineConfig } from "@httpx/dx/oxlint";

export default defineConfig({
  extends: [oxlintDefaultConfig],
  ignorePatterns: ["**/docs"],
  overrides: [
    {
      // Base64 data and atob() binary strings only contain chars <= 0xff,
      // charCodeAt is exact and always returns a number
      files: ["src/base64/base64.purejs.ts", "src/base64/base64.atob.ts"],
      rules: {
        "unicorn/prefer-code-point": "off",
      },
    },
    {
      // Pure js base64 codec: bitwise operations on byte chunks are the algorithm
      files: ["src/base64/base64.purejs.ts"],
      rules: {
        "no-bitwise": "off",
        // typed array reads in the hot loops are always in bounds, `as number`
        // documents it without the `!` operator (no-non-null-assertion)
        "typescript/non-nullable-type-assertion-style": "off",
      },
    },
  ],
});
