import { createVitestConfig } from "@httpx/devtools-vitest";
import { mergeConfig } from "vitest/config";

import pkg from "./package.json" with { type: "json" };

export default mergeConfig(createVitestConfig(), {
  // same as tsdown.config.ts
  define: {
    __HTTPX_EXCEPTION_MAJOR__: JSON.stringify(pkg.version.split(".")[0]),
  },
});
