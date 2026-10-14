import { createOxlintNextjsConfig } from "@httpx/dx";
import { defineConfig } from "@httpx/dx/oxlint";

const nextjsConfig = createOxlintNextjsConfig({
  // the css file containing `@import "tailwindcss"`
  tailwindEntryPoint: "src/styles/global.css",
});

export default defineConfig({
  ...nextjsConfig,
  rules: {
    ...nextjsConfig.rules,
  },
  overrides: [
    ...nextjsConfig.overrides,
    {
      // nextra calls `head` as a component, hooks are valid there; useConfig() is untyped (any)
      files: ["theme.config.tsx"],
      rules: {
        "react-hooks/rules-of-hooks": "off",
        "typescript/no-unsafe-assignment": "off",
      },
    },
  ],
});
