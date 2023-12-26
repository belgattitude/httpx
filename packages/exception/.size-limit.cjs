// @ts-check

const fullEsmMaxSize = "1506B";
const fullCjsMaxSize = "1925B";

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
    limit: "348B",
  },
  {
    name: "ESM (only HttpClientException exception)",
    path: ["dist/index.mjs"],
    import: "{ HttpClientException }",
    limit: "370B",
  },
  {
    name: "ESM (only HttpNotFound exception)",
    path: ["dist/index.mjs"],
    import: "{ HttpNotFound }",
    limit: "405B",
  },
  {
    name: "ESM (2 client exceptions: HttpNotFound + HttpRequestTimeout)",
    path: ["dist/index.mjs"],
    import: "{ HttpNotFound, HttpRequestTimeout }",
    limit: "416B",
  },
  {
    name: "ESM (6 client exceptions: NotFound + RequestTimeout + HttpConflict...)",
    path: ["dist/index.mjs"],
    import: "{ HttpNotFound, HttpRequestTimeout, HttpConflict, HttpGone, HttpMethodNotAllowed, HttpForbidden }",
    limit: "430B",
  },
  {
    name: "ESM (1 client and 1 server exception)",
    path: ["dist/index.mjs"],
    import: "{ HttpNotFound, HttpInternalServerError }",
    limit: "416B",
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
    limit: "690B", // Will import all server/client exceptions
  },
  {
    name: "ESM serializer ({ toJson })",
    path: ["dist/serializer/index.mjs"],
    import: "{ toJson }",
    limit: "867B",
  },
  {
    name: "ESM serializer ({ fromJson })",
    path: ["dist/serializer/index.mjs"],
    import: "{ fromJson }",
    limit: "1120B",
  },
  {
    name: "ESM serializer ({ fromJson, toJson })",
    path: ["dist/serializer/index.mjs"],
    import: "{ fromJson, toJson }",
    limit: "1395B",
  },
  {
    name: "ESM experimental ({ tryOrFail })",
    path: ["dist/experimental/index.mjs"],
    import: "{ tryOrFail }",
    limit: "800B",
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
    limit: '1130B',
  }
];
