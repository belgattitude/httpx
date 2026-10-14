import { createOxlintNextjsConfig } from "@httpx/dx";
import { defineConfig } from "@httpx/dx/oxlint";

const nextjsConfig = createOxlintNextjsConfig({
  // the css file containing `@import "tailwindcss"`
  tailwindEntryPoint: "src/styles/globals.css",
});

export default defineConfig({
  ...nextjsConfig,
  rules: {
    ...nextjsConfig.rules,
  },
  overrides: [
    ...nextjsConfig.overrides,
    {
      // the `@/lib` and `@/server` aliases are the app public entry points
      files: ["src/lib/index.ts", "src/server/index.ts"],
      rules: {
        "oxc/no-barrel-file": "off",
      },
    },
  ],
});
