import type { SizeLimitConfig } from "size-limit";

const config = [
  {
    name: "import { LruCache } (ESM)",
    path: ["dist/index.js"],
    import: "{ LruCache }",
    limit: "587B",
  },
  {
    name: "import { getOrCreateLruCache } (ESM)",
    path: ["dist/index.js"],
    import: "{ getOrCreateLruCache }",
    limit: "675B",
  },
  {
    name: "import { TimeLruCache } (ESM)",
    path: ["dist/index.js"],
    import: "{ TimeLruCache }",
    limit: "710B",
  },
  {
    name: "import { getOrCreateTimeLruCache } (ESM)",
    path: ["dist/index.js"],
    import: "{ getOrCreateTimeLruCache }",
    limit: "790B",
  },
] satisfies SizeLimitConfig;

export default config;
