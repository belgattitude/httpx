import type { SizeLimitConfig } from "size-limit";

const config = [
  {
    name: "Only { isPlainObject } (ESM)",
    path: ["dist/index.js"],
    import: "{ isPlainObject }",
    limit: "81B",
  },
  {
    name: "Only { assertPlainObject } (ESM)",
    path: ["dist/index.js"],
    import: "{ assertPlainObject }",
    limit: "155B",
  },
  {
    name: "Import { assertPlainObject, isPlainObject } (ESM)",
    path: ["dist/index.js"],
    import: "{ assertPlainObject, isPlainObject }",
    limit: "143B",
  },
] satisfies SizeLimitConfig;

export default config;
