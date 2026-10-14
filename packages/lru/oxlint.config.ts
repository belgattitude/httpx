import { oxlintDefaultConfig } from "@httpx/dx";
import { defineConfig } from "@httpx/dx/oxlint";

export default defineConfig({
  extends: [oxlintDefaultConfig],
  ignorePatterns: ["**/_release", "**/docs"],
  overrides: [
    {
      // Null object caches: no-op methods and constructors keeping the signature of the cache they replace
      files: ["src/null-lru-cache.ts", "src/null-time-lru-cache.ts"],
      rules: {
        "no-empty-function": "off",
        "no-useless-constructor": "off",
      },
    },
  ],
});
