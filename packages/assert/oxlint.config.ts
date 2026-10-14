import { oxlintDefaultConfig } from "@httpx/dx";
import { defineConfig } from "@httpx/dx/oxlint";

export default defineConfig({
  extends: [oxlintDefaultConfig],
  ignorePatterns: ["**/_release", "**/docs"],
  overrides: [
    {
      // public entrypoint of the package, re-exporting every module is intended
      files: ["src/index.ts"],
      rules: {
        "oxc/no-barrel-file": "off",
      },
    },
    {
      files: ["src/__tests__/**"],
      plugins: ["vitest"],
      rules: {
        // false positive: expects live inside it.each / it.skipIf(...) callbacks
        "vitest/no-standalone-expect": "off",
        // test cases are deliberately unusual values (empty class, bare Error, new Promise, spread arrays)
        "typescript/no-extraneous-class": "off",
        "unicorn/error-message": "off",
        "unicorn/no-useless-spread": "off",
        "promise/avoid-new": "off",
      },
    },
  ],
});
