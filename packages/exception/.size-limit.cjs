// @ts-check

const fullEsmMaxSize = "3080B";
const fullCjsMaxSize = "4700B";

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
    limit: "1288B",
  },
  {
    name: "ESM (only HttpInternalServerError)",
    path: ["dist/index.mjs"],
    import: "{ HttpInternalServerError }",
    limit: "1295B",
  },
  {
    name: "ESM (two exceptions: HttpNotFound + HttpInternalServerError)",
    path: ["dist/index.mjs"],
    import: "{ HttpNotFound, HttpInternalServerError }",
    limit: "1350B",
  },
  {
    name: "ESM (only isHttpException)",
    path: ["dist/index.mjs"],
    import: "{ isHttpException }",
    limit: "1050B",
  },
  {
    name: "ESM (only createHttpException)",
    path: ["dist/index.mjs"],
    import: "{ createHttpException }",
    limit: "2605B", // Will import all server/client exceptions
  },

  {
    name: "ESM ({ toJson })",
    path: ["dist/serializer/index.mjs"],
    import: "{ toJson }",
    limit: "1890B",
  },
  {
    name: "ESM ({ fromJson })",
    path: ["dist/serializer/index.mjs"],
    import: "{ fromJson }",
    limit: "3265B",
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
    limit: '4350B',
  }
];
