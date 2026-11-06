import type { SizeLimitConfig } from "size-limit";

const config = [
  {
    name: "import { detectBarcodeType } (ESM)",
    path: ["dist/index.js"],
    import: "{ detectBarcodeType }",
    limit: "420B",
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
    limit: "535B",
  },
  {
    name: "import { formatGtin } (ESM)",
    path: ["dist/index.js"],
    import: "{ formatGtin }",
    limit: "455B",
  },
  {
    name: "import { assertNormalizedGtin } (ESM)",
    path: ["dist/index.js"],
    import: "{ assertNormalizedGtin }",
    limit: "655B",
  },
  {
    name: "import { isRestrictedCirculation } (ESM)",
    path: ["dist/index.js"],
    import: "{ isRestrictedCirculation }",
    limit: "495B",
  },
  {
    name: "import { parseGtin } (ESM)",
    path: ["dist/index.js"],
    import: "{ parseGtin }",
    limit: "1280B",
  },
  {
    name: "import { parseGtinOrThrow } (ESM)",
    path: ["dist/index.js"],
    import: "{ parseGtinOrThrow }",
    limit: "1405B",
  },
  {
    name: "import { isUpcE } (ESM)",
    path: ["dist/index.js"],
    import: "{ isUpcE }",
    limit: "460B",
  },
  {
    name: "import { assertUpcE } (ESM)",
    path: ["dist/index.js"],
    import: "{ assertUpcE }",
    limit: "610B",
  },
  {
    name: "import { expandUpcE } (ESM)",
    path: ["dist/index.js"],
    import: "{ expandUpcE }",
    limit: "495B",
  },
  {
    name: "import { compressUpcA } (ESM)",
    path: ["dist/index.js"],
    import: "{ compressUpcA }",
    limit: "615B",
  },
  {
    name: "import { createGtinParser } (ESM)",
    path: ["dist/index.js"],
    import: "{ createGtinParser }",
    limit: "1560B",
  },
] satisfies SizeLimitConfig;

export default config;
