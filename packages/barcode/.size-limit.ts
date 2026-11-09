import type { SizeLimitConfig } from "size-limit";

const config = [
  {
    name: "import { detectBarcodeType } (ESM)",
    path: ["dist/index.js"],
    import: "{ detectBarcodeType }",
    limit: "470B",
  },
  {
    name: "import { isGtin } (ESM)",
    path: ["dist/index.js"],
    import: "{ isGtin }",
    limit: "195B",
  },
  {
    name: "import { isEan13 } (ESM)",
    path: ["dist/index.js"],
    import: "{ isEan13 }",
    limit: "185B",
  },
  {
    name: "import { isEan8, isEan13, isGtin14, isUpcA } (ESM)",
    path: ["dist/index.js"],
    import: "{ isEan8, isEan13, isGtin14, isUpcA }",
    limit: "200B",
  },
  {
    name: "import { assertEan13 } (ESM)",
    path: ["dist/index.js"],
    import: "{ assertEan13 }",
    limit: "325B",
  },
  {
    name: "import { assertEan8, assertEan13, assertGtin, assertGtin14, assertUpcA } (ESM)",
    path: ["dist/index.js"],
    import: "{ assertEan8, assertEan13, assertGtin, assertGtin14, assertUpcA }",
    limit: "425B",
  },
  {
    name: "import { normalizeGtin } (ESM)",
    path: ["dist/index.js"],
    import: "{ normalizeGtin }",
    limit: "425B",
  },
  {
    name: "import { formatGtin } (ESM)",
    path: ["dist/index.js"],
    import: "{ formatGtin }",
    limit: "335B",
  },
  {
    name: "import { assertNormalizedGtin } (ESM)",
    path: ["dist/index.js"],
    import: "{ assertNormalizedGtin }",
    limit: "565B",
  },
  {
    name: "import { isInStoreGtin } (ESM)",
    path: ["dist/index.js"],
    import: "{ isInStoreGtin }",
    limit: "525B",
  },
  {
    name: "import { parseGtin } (ESM)",
    path: ["dist/index.js"],
    import: "{ parseGtin }",
    limit: "1465B",
  },
  {
    name: "import { parseGtinOrThrow } (ESM)",
    path: ["dist/index.js"],
    import: "{ parseGtinOrThrow }",
    limit: "1585B",
  },
  {
    name: "import { isUpcE } (ESM)",
    path: ["dist/index.js"],
    import: "{ isUpcE }",
    limit: "210B",
  },
  {
    name: "import { assertUpcE } (ESM)",
    path: ["dist/index.js"],
    import: "{ assertUpcE }",
    limit: "350B",
  },
  {
    name: "import { expandUpcE } (ESM)",
    path: ["dist/index.js"],
    import: "{ expandUpcE }",
    limit: "410B",
  },
  {
    name: "import { compressUpcA } (ESM)",
    path: ["dist/index.js"],
    import: "{ compressUpcA }",
    limit: "510B",
  },
  {
    name: "import { createGtinParser } (ESM)",
    path: ["dist/index.js"],
    import: "{ createGtinParser }",
    limit: "1735B",
  },
] satisfies SizeLimitConfig;

export default config;
