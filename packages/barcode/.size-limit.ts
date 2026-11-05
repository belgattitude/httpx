import type { SizeLimitConfig } from "size-limit";

const config = [
  {
    name: "import { detectBarcodeType } (ESM)",
    path: ["dist/index.js"],
    import: "{ detectBarcodeType }",
    limit: "375B",
  },
  {
    name: "import { isGtin } (ESM)",
    path: ["dist/index.js"],
    import: "{ isGtin }",
    limit: "350B",
  },
  {
    name: "import { isEan13 } (ESM)",
    path: ["dist/index.js"],
    import: "{ isEan13 }",
    limit: "335B",
  },
  {
    name: "import { isEan8, isEan13, isGtin14, isUpcA } (ESM)",
    path: ["dist/index.js"],
    import: "{ isEan8, isEan13, isGtin14, isUpcA }",
    limit: "355B",
  },
  {
    name: "import { assertEan13 } (ESM)",
    path: ["dist/index.js"],
    import: "{ assertEan13 }",
    limit: "465B",
  },
  {
    name: "import { assertEan8, assertEan13, assertGtin, assertGtin14, assertUpcA } (ESM)",
    path: ["dist/index.js"],
    import: "{ assertEan8, assertEan13, assertGtin, assertGtin14, assertUpcA }",
    limit: "570B",
  },
  {
    name: "import { normalizeGtin } (ESM)",
    path: ["dist/index.js"],
    import: "{ normalizeGtin }",
    limit: "505B",
  },
  {
    name: "import { formatGtin } (ESM)",
    path: ["dist/index.js"],
    import: "{ formatGtin }",
    limit: "415B",
  },
  {
    name: "import { assertNormalizedGtin } (ESM)",
    path: ["dist/index.js"],
    import: "{ assertNormalizedGtin }",
    limit: "625B",
  },
  {
    name: "import { isRestrictedCirculation } (ESM)",
    path: ["dist/index.js"],
    import: "{ isRestrictedCirculation }",
    limit: "465B",
  },
] satisfies SizeLimitConfig;

export default config;
