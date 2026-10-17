import { createOxlintNextjsConfig } from "@httpx/dx";
import { defineConfig } from "@httpx/dx/oxlint";

const nextjsConfig = createOxlintNextjsConfig({
  // the css file containing `@import "tailwindcss"`
  tailwindEntryPoint: "src/app/global.css",
});

export default defineConfig({
  ...nextjsConfig,
  rules: {
    ...nextjsConfig.rules,
  },
  overrides: [...nextjsConfig.overrides],
});
