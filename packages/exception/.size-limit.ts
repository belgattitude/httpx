import type { SizeLimitConfig } from "size-limit";

const fullEsmMaxSize = "1765B";
const fullCjsMaxSize = "2250B";

const config = [
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
    limit: "425B",
  },
  {
    name: "ESM (only HttpClientException exception)",
    path: ["dist/index.mjs"],
    import: "{ HttpClientException }",
    limit: "438B",
  },
  {
    name: "ESM (only HttpNotFound exception)",
    path: ["dist/index.mjs"],
    import: "{ HttpNotFound }",
    limit: "471B",
  },
  {
    name: "ESM (2 client exceptions: HttpNotFound + HttpRequestTimeout)",
    path: ["dist/index.mjs"],
    import: "{ HttpNotFound, HttpRequestTimeout }",
    limit: "490B",
  },
  {
    name: "ESM (6 client exceptions: NotFound + RequestTimeout + HttpConflict...)",
    path: ["dist/index.mjs"],
    import:
      "{ HttpNotFound, HttpRequestTimeout, HttpConflict, HttpGone, HttpMethodNotAllowed, HttpForbidden }",
    limit: "545B",
  },
  {
    name: "ESM (1 client and 1 server exception)",
    path: ["dist/index.mjs"],
    import: "{ HttpNotFound, HttpInternalServerError }",
    limit: "510B",
  },
  {
    name: "ESM (only isHttpException)",
    path: ["dist/index.mjs"],
    import: "{ isHttpException }",
    limit: "460B",
  },
  {
    name: "ESM (only createHttpException)",
    path: ["dist/index.mjs"],
    import: "{ createHttpException }",
    limit: "1132B",
  },
  {
    name: "ESM (createHttpException + isHttpException)",
    path: ["dist/index.mjs"],
    import: "{ createHttpException, isHttpException }",
    limit: "1166B",
  },
  {
    name: "ESM (createHttpException + isHttpException + isHttpClientException )",
    path: ["dist/index.mjs"],
    import: "{ createHttpException, isHttpException, isHttpClientException }",
    limit: "1176B",
  },
  {
    name: "ESM serializer ({ toJson })",
    path: ["dist/serializer/index.mjs"],
    import: "{ toJson }",
    limit: "1026B",
  },
  {
    name: "ESM serializer ({ fromJson })",
    path: ["dist/serializer/index.mjs"],
    import: "{ fromJson }",
    limit: "1722B",
  },
  {
    name: "ESM all serializer ({ fromJson, toJson, convertToSerializable, createFromSerializable })",
    path: ["dist/serializer/index.mjs"],
    import:
      "{ fromJson, toJson, createFromSerializable, convertToSerializable }",
    limit: "2032B",
  },
  {
    name: "ESM experimental ({ tryOrFail })",
    path: ["dist/experimental/index.mjs"],
    import: "{ tryOrFail }",
    limit: "1271B",
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
    limit: "1980B",
  },
] satisfies SizeLimitConfig;

export default config;
