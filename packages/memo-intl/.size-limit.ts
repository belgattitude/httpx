import type { SizeLimitConfig } from "size-limit";

const config = [
  {
    name: "Everything (ESM)",
    path: ["dist/index.js"],
    import: "*",
    limit: "1250B",
  },
  {
    name: "MIntl (ESM)",
    path: ["dist/index.js"],
    import: "{ MIntl }",
    limit: "1050B",
  },
] satisfies SizeLimitConfig;

export default config;
