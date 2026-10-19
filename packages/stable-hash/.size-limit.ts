import type { SizeLimitConfig } from "size-limit";

const config = [
  {
    name: "Everything (ESM)",
    path: ["dist/index.js"],
    import: "*",
    limit: "980B",
  },
  {
    name: "createStableKeyOrThrow (ESM)",
    path: ["dist/index.js"],
    import: "{ createStableKeyOrThrow }",
    limit: "482B",
  },
  {
    name: "createStableKey (ESM)",
    path: ["dist/index.js"],
    import: "{ createStableKey }",
    limit: "520B",
  },
  {
    name: "createStableHashOrThrow (ESM)",
    path: ["dist/index.js"],
    import: "{ createStableHashOrThrow }",
    limit: "660B",
  },
  {
    name: "createStableHash (ESM)",
    path: ["dist/index.js"],
    import: "{ createStableHash }",
    limit: "695B",
  },
] satisfies SizeLimitConfig;

export default config;
