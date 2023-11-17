// @ts-check

const fullEsmMaxSize = "1500B";
const fullCjsMaxSize = "2000B";

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
    limit: "340B",
  },
  {
    name: "ESM (only HttpNotFound exception)",
    path: ["dist/index.mjs"],
    import: "{ HttpNotFound }",
    limit: "400B",
  },
  {
    name: "ESM (two client exceptions: HttpNotFound + HttpRequestTimeout)",
    path: ["dist/index.mjs"],
    import: "{ HttpNotFound, HttpRequestTimeout }",
    limit: "435B",
  },
  {
    name: "ESM (only isHttpException)",
    path: ["dist/index.mjs"],
    import: "{ isHttpException }",
    limit: "390B",
  },
  {
    name: "ESM (only createHttpException)",
    path: ["dist/index.mjs"],
    import: "{ createHttpException }",
    limit: "800B", // Will import all server/client exceptions
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
    limit: "1500B",
  },
  {
    name: "ESM ({ toJson })",
    path: ["dist/serializer/index.mjs"],
    import: "{ toJson }",
    limit: "900B",
  },
  {
    name: "ESM ({ fromJson, toJson })",
    path: ["dist/serializer/index.mjs"],
    import: "{ fromJson, toJson }",
    limit: "1500B",
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
    limit: '1100B',
  }
];
