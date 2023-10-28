// @ts-check

const fullEsmMaxSize = "1780B";
const fullCjsMaxSize = "2300B";

/**
 * Will ensure esm tree-shakeability and total size are within expectations.
 *
 * @link https://github.com/ai/size-limit/
 * @type {{name: string, path: string[], limit: string, import?: string, webpack?: boolean}[]}
 */
module.exports = [
  // ###################################################
  // ESM full bundle and individual imports
  // ###################################################
  {
    name: "ESM (import everything *)",
    path: ["dist/index.mjs"],
    import: "*",
    limit: fullEsmMaxSize,
  },
  {
    name: "ESM (only HttpException exception)",
    path: ["dist/index.mjs"],
    import: "{ HttpException }",
    limit: "399B",
  },
  {
    name: "ESM (only HttpNotFound exception)",
    path: ["dist/index.mjs"],
    import: "{ HttpNotFound }",
    limit: "461B",
  },
  {
    name: "ESM (two client exceptions: HttpNotFound + HttpRequestTimeout)",
    path: ["dist/index.mjs"],
    import: "{ HttpNotFound, HttpRequestTimeout }",
    limit: "492B",
  },
  {
    name: "ESM (only isHttpException)",
    path: ["dist/index.mjs"],
    import: "{ isHttpException }",
    limit: "405B",
  },
  {
    name: "ESM (only createHttpException)",
    path: ["dist/index.mjs"],
    import: "{ createHttpException }",
    limit: "900B", // Will import all server/client exceptions
  },
  {
    name: "ESM ({ toJson })",
    path: ["dist/serializer/index.mjs"],
    import: "{ toJson }",
    limit: "960B",
  },
  {
    name: "ESM ({ fromJson })",
    path: ["dist/serializer/index.mjs"],
    import: "{ fromJson }",
    limit: "2000B",
  },
  {
    name: "ESM ({ toJson })",
    path: ["dist/serializer/index.mjs"],
    import: "{ toJson }",
    limit: "960B",
  },
  {
    name: "ESM ({ fromJson, toJson })",
    path: ["dist/serializer/index.mjs"],
    import: "{ fromJson, toJson }",
    limit: "2000B",
  },
  // ###################################################
  // Commonjs full bundle
  // ###################################################
  {
    name: "CJS (require everything *)",
    path: ["dist/index.cjs"],
    import: "*",
    webpack: true,
    limit: fullCjsMaxSize,
  },
  {
    name: "CJS (only isHttpException)",
    path: ["dist/index.cjs"],
    import: "{ isHttpException }",
    webpack: true,
    limit: '1364B',
  }
];
