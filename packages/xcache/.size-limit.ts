import type { SizeLimitConfig } from "size-limit";

const config = [
  {
    name: "import { XMemCache } (ESM)",
    path: ["dist/index.js"],
    import: "{ XMemCache }",
    limit: "2160B",
  },
  {
    name: "import { TimeLruCache } (ESM)",
    path: ["dist/index.js"],
    import: "{ TimeLruCache }",
    limit: "720B",
  },
  {
    name: "import { createHonoXCache } (ESM)",
    path: ["dist/hono/index.js"],
    import: "{ createHonoXCache }",
    limit: "5280B",
  },
] satisfies SizeLimitConfig;

export default config;
