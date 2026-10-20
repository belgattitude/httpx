import { oxlintDefaultConfig } from "@httpx/dx";
import { defineConfig } from "@httpx/dx/oxlint";

export default defineConfig({
  extends: [oxlintDefaultConfig],
  ignorePatterns: ["**/_release", "**/docs"],
  overrides: [
    {
      // HttpException is public api: its class name and the `name` set in its constructor must not change
      files: ["src/base/HttpException.ts"],
      rules: {
        "unicorn/custom-error-definition": "off",
      },
    },
    {
      // public entry points re-exporting the package api
      files: ["src/**/index.ts"],
      rules: {
        "oxc/no-barrel-file": "off",
      },
    },
    {
      files: ["**/*.test.ts"],
      plugins: ["vitest"],
      rules: {
        // tests deliberately build errors without message to check the serialization / typeguards
        "unicorn/error-message": "off",
        // a hint renames the existing snapshot keys
        "vitest/prefer-snapshot-hint": "off",
      },
    },
  ],
});
