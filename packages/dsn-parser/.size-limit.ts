import type { SizeLimitConfig } from "size-limit";

const config = [
  {
    name: "Everything (ESM)",
    path: ["dist/index.js"],
    import: "*",
    limit: "1215B",
  },
  {
    name: "Only parseDsn (ESM)",
    path: ["dist/index.js"],
    import: "{ parseDsn }",
    limit: "810B",
  },
  {
    name: "Everything (CJS)",
    import: "*",
    path: ["dist/index.cjs"],
    limit: "1460B",
  },
] satisfies SizeLimitConfig;

export default config;
