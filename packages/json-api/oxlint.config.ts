import { oxlintDefaultConfig } from "@httpx/dx";
import { defineConfig } from "@httpx/dx/oxlint";

export default defineConfig({
  extends: [oxlintDefaultConfig],
  ignorePatterns: ["**/_release", "**/docs"],
  overrides: [
    {
      // JsonApiErrorFactory / JsonApiResponseFactory are public api (static-only classes)
      files: [
        "src/json-api-error.factory.ts",
        "src/json-api-response.factory.ts",
      ],
      rules: {
        "typescript/no-extraneous-class": "off",
      },
    },
    {
      // typeguard fixtures deliberately build empty classes, errors and promises
      files: ["src/__tests__/typeguards.test.ts"],
      rules: {
        "typescript/no-extraneous-class": "off",
        "unicorn/error-message": "off",
        "promise/avoid-new": "off",
      },
    },
  ],
});
