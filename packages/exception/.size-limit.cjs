// @ts-check

const fullEsmMaxSize = "3080B";
const fullCjsMaxSize = "3265B";

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
    path: ["dist/esm/index.js"],
    import: "*",
    limit: fullEsmMaxSize,
  },
  {
    name: "ESM (only HttpNotFound exception)",
    path: ["dist/esm/index.js"],
    import: "{ HttpNotFound }",
    limit: "1288B",
  },
  {
    name: "ESM (only HttpInternalServerError)",
    path: ["dist/esm/index.js"],
    import: "{ HttpInternalServerError }",
    limit: "1295B",
  },
  {
    name: "ESM (two exceptions: HttpNotFound + HttpInternalServerError)",
    path: ["dist/esm/index.js"],
    import: "{ HttpNotFound, HttpInternalServerError }",
    limit: "1350B",
  },
  {
    name: "ESM (only isHttpException)",
    path: ["dist/esm/index.js"],
    import: "{ isHttpException }",
    limit: "1050B",
  },
  {
    name: "ESM (only createHttpException)",
    path: ["dist/esm/index.js"],
    import: "{ createHttpException }",
    limit: "2595B", // Will import all server/client exceptions
  },
  {
    name: "ESM ({ toJson })",
    path: ["dist/esm/serializer/index.js"],
    import: "{ toJson }",
    limit: "1890B",
  },
  {
    name: "ESM ({ fromJson })",
    path: ["dist/esm/serializer/index.js"],
    import: "{ fromJson }",
    limit: "3250B",
  },
  // ###################################################
  // Commonjs full bundle
  // ###################################################
  {
    name: "CJS (require everything *)",
    path: ["dist/cjs/index.cjs"],
    import: "*",
    webpack: true,
    limit: fullCjsMaxSize,
  },
  {
    name: "CJS (only isHttpException)",
    path: ["dist/cjs/index.cjs"],
    import: "{ isHttpException }",
    webpack: true,
    limit: '2385B',
  }
];
