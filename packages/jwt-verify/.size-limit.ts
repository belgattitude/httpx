import type { SizeLimitConfig } from "size-limit";

const config = [
  {
    name: "import { JwtVerifier } (ESM)",
    path: ["dist/index.js"],
    import: "{ JwtVerifier }",
    limit: "17KB",
  },
  {
    name: "import { OidcDiscoveryFetcher } (ESM)",
    path: ["dist/index.js"],
    import: "{ OidcDiscoveryFetcher }",
    limit: "11KB",
  },
] satisfies SizeLimitConfig;

export default config;
