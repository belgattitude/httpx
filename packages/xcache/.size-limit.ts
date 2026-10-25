import type { SizeLimitConfig } from "size-limit";

const config = [
  {
    name: "import { XMemCache } (ESM)",
    path: ["dist/index.js"],
    import: "{ XMemCache }",
    limit: "2680B",
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
    limit: "6040B",
  },
  {
    name: "import { SuperjsonSerializer } (ESM)",
    path: ["dist/superjson.js"],
    import: "{ SuperjsonSerializer }",
    ignore: ["superjson"],
    limit: "180B",
  },
  {
    name: "import { DevalueSerializer } (ESM)",
    path: ["dist/devalue.js"],
    import: "{ DevalueSerializer }",
    ignore: ["devalue"],
    limit: "110B",
  },
  {
    name: "import { CborxSerializer } (ESM)",
    path: ["dist/cbor-x.js"],
    import: "{ CborxSerializer }",
    ignore: ["cbor-x"],
    limit: "160B",
  },
] satisfies SizeLimitConfig;

export default config;
