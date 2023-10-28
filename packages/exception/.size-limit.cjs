// @ts-check

const fullEsmMaxSize = "2070B";
const fullCjsMaxSize = "2700B";

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
    name: "ESM (only HttpNotFound exception)",
    path: ["dist/index.mjs"],
    import: "{ HttpNotFound }",
    limit: "460B",
  },
  {
    name: "ESM (two exceptions: HttpNotFound + HttpInternalServerError)",
    path: ["dist/index.mjs"],
    import: "{ HttpNotFound, HttpInternalServerError }",
    limit: "510B",
  },
  {
    name: "ESM (only isHttpException)",
    path: ["dist/index.mjs"],
    import: "{ isHttpException }",
    limit: "400B",
  },
  {
    name: "ESM (only createHttpException)",
    path: ["dist/index.mjs"],
    import: "{ createHttpException }",
    limit: "1500B", // Will import all server/client exceptions
  },
  {
    name: "ESM ({ toJson })",
    path: ["dist/serializer/index.mjs"],
    import: "{ toJson }",
    limit: "930B",
  },
  {
    name: "ESM ({ fromJson })",
    path: ["dist/serializer/index.mjs"],
    import: "{ fromJson }",
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
    limit: '2500B',
  }
];
