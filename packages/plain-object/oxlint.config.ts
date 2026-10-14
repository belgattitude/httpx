import { oxlintDefaultConfig } from "@httpx/dx";
import { defineConfig } from "@httpx/dx/oxlint";

export default defineConfig({
  extends: [oxlintDefaultConfig],
  ignorePatterns: ["**/_release", "**/docs"],
  overrides: [
    {
      files: ["src/__tests__/is-plain-object.test.ts"],
      plugins: ["vitest"],
      rules: {
        // false positive: expects live inside it.each / it.skipIf(...) callbacks
        "vitest/no-standalone-expect": "off",
        // compat suites with other libs are skipped on purpose (known divergences)
        "vitest/no-disabled-tests": "off",
        // the test cases are deliberately unusual values (empty class, bare Error, new Promise)
        "typescript/no-extraneous-class": "off",
        "unicorn/error-message": "off",
        "promise/avoid-new": "off",
      },
    },
  ],
});
