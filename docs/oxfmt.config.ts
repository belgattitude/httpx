import { oxfmtDefaultConfig } from "@httpx/dx";
import { defineConfig } from "@httpx/dx/oxfmt";

export default defineConfig({
  ...oxfmtDefaultConfig,
  sortTailwindcss: {
    ...(typeof oxfmtDefaultConfig.sortTailwindcss === "object"
      ? oxfmtDefaultConfig.sortTailwindcss
      : {}),
    stylesheet: "./src/app/global.css",
  },
});
