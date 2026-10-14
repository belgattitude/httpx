import codspeedPlugin from "@codspeed/vitest-plugin";
import { defineConfig } from "vitest/config";

const testFiles = [
  "./src/**/*.test.{js,ts}",
  "./test/**/*.test.{js,ts}",
  "./e2e/**/*.test.ts",
];

const isCodeSpeedEnabled = process.env?.CODSPEED === "1";
const cspeed = isCodeSpeedEnabled ? codspeedPlugin() : undefined;

export default defineConfig({
  plugins: [cspeed].filter(Boolean),
  resolve: {
    conditions: ["httpx-monorepo-source"],
  },
  ssr: {
    resolve: {
      conditions: ["httpx-monorepo-source", "import", "default"],
    },
  },
  test: {
    globalSetup: "./vitest.setup.ts",
    deps: {
      optimizer: {
        ssr: { enabled: true },
      },
    },
    coverage: {
      include: ["src/**/*.{js,jsx,ts,tsx}"],
      provider: "v8",
      reporter: ["text", "clover"],
    },
    environment: "node",
    exclude: [
      "**/node_modules/**",
      "dist/**",
      "**/coverage/**",
      "**/.{idea,git,cache,output,temp}/**",
    ],
    globals: true,
    include: testFiles,
    setupFiles: "./tests/vitest.setup.ts",
  },
});
