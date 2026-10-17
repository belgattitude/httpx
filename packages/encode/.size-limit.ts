import type { SizeLimitConfig } from "size-limit";

const config = [
  {
    name: "Only { Base64 } (index)",
    path: ["dist/index.js"],
    module: true,
    import: "{ Base64 }",
    limit: "1800B",
  },
  {
    name: "Only { Base64 } (index.uint8)",
    path: ["dist/index.uint8.js"],
    module: true,
    import: "{ Base64 }",
    limit: "400B",
  },
  {
    name: "Only { Base64 } (index.browser)",
    path: ["dist/index.browser.js"],
    module: true,
    import: "{ Base64 }",
    limit: "1450B",
  },
  {
    name: "Only { Base64 } (index.default)",
    path: ["dist/index.default.js"],
    module: true,
    import: "{ Base64 }",
    limit: "1450B",
  },
  {
    name: "Only { Base64 } (purejs)",
    path: ["dist/base64/base64.purejs.js"],
    import: "{ Base64Purejs }",
    limit: "1100B",
  },
  {
    name: "Only { Base64 } (node20)",
    path: ["dist/base64/base64.node20.js"],
    import: "{ Base64Node20 }",
    limit: "1000B",
  },
  {
    name: "Only { Base64 } (atob)",
    path: ["dist/base64/base64.atob.js"],
    import: "{ Base64Atob }",
    limit: "900B",
  },
  {
    name: "Only { Base64 } (uint8array)",
    path: ["dist/base64/base64.uint8array.js"],
    import: "{ Base64Uint8Array }",
    limit: "400B",
  },
] satisfies SizeLimitConfig;

export default config;
