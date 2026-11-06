import type { SizeLimitConfig } from "size-limit";

const config = [
  {
    name: "import { detectBarcodeType } (ESM)",
    path: ["dist/index.js"],
    import: "{ detectBarcodeType }",
    limit: "395B",
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
    limit: "565B",
  },
  {
    name: "import { formatGtin } (ESM)",
    path: ["dist/index.js"],
    import: "{ formatGtin }",
    limit: "465B",
  },
  {
    name: "import { assertNormalizedGtin } (ESM)",
    path: ["dist/index.js"],
    import: "{ assertNormalizedGtin }",
    limit: "690B",
  },
  {
    name: "import { isRestrictedCirculation } (ESM)",
    path: ["dist/index.js"],
    import: "{ isRestrictedCirculation }",
    limit: "515B",
  },
  {
    name: "import { parseGtin } (ESM)",
    path: ["dist/index.js"],
    import: "{ parseGtin }",
    limit: "1360B",
  },
  {
    name: "import { parseGtinOrThrow } (ESM)",
    path: ["dist/index.js"],
    import: "{ parseGtinOrThrow }",
    limit: "1490B",
  },
  {
    name: "import { isUpcE } (ESM)",
    path: ["dist/index.js"],
    import: "{ isUpcE }",
    limit: "485B",
  },
  {
    name: "import { assertUpcE } (ESM)",
    path: ["dist/index.js"],
    import: "{ assertUpcE }",
    limit: "640B",
  },
  {
    name: "import { expandUpcE } (ESM)",
    path: ["dist/index.js"],
    import: "{ expandUpcE }",
    limit: "520B",
  },
  {
    name: "import { compressUpcA } (ESM)",
    path: ["dist/index.js"],
    import: "{ compressUpcA }",
    limit: "635B",
  },
  {
    name: "import { createGtinParser } (ESM)",
    path: ["dist/index.js"],
    import: "{ createGtinParser }",
    limit: "1630B",
  },
] satisfies SizeLimitConfig;

export default config;
