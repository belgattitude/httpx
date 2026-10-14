import { oxlintDefaultConfig } from "@httpx/dx";
import { defineConfig } from "@httpx/dx/oxlint";

export default defineConfig({
  extends: [oxlintDefaultConfig],
  ignorePatterns: ["**/_release", "**/docs"],
  overrides: [
    {
      // public api: errors are identified by their `type` (createHasInstance), class names and `name` must not change
      files: ["src/error/**"],
      rules: {
        "unicorn/custom-error-definition": "off",
      },
    },
  ],
});
