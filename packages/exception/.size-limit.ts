import type { SizeLimitConfig } from "size-limit";

const fullEsmMaxSize = "1747B";

const config = [
  // ###################################################
  // ESM full bundle and individual imports
  // ###################################################
  {
    name: "ESM (import everything *)",
    path: ["dist/index.js"],
    import: "*",
    limit: fullEsmMaxSize,
  },
  {
    name: "ESM (only HttpException exception)",
    path: ["dist/index.js"],
    import: "{ HttpException }",
    limit: "444B",
  },
  {
    name: "ESM (only HttpClientException exception)",
    path: ["dist/index.js"],
    import: "{ HttpClientException }",
    limit: "457B",
  },
  {
    name: "ESM (only HttpNotFound exception)",
    path: ["dist/index.js"],
    import: "{ HttpNotFound }",
    limit: "490B",
  },
  {
    name: "ESM (2 client exceptions: HttpNotFound + HttpRequestTimeout)",
    path: ["dist/index.js"],
    import: "{ HttpNotFound, HttpRequestTimeout }",
    limit: "509B",
  },
  {
    name: "ESM (6 client exceptions: NotFound + RequestTimeout + HttpConflict...)",
    path: ["dist/index.js"],
    import:
      "{ HttpNotFound, HttpRequestTimeout, HttpConflict, HttpGone, HttpMethodNotAllowed, HttpForbidden }",
    limit: "573B",
  },
  {
    name: "ESM (1 client and 1 server exception)",
    path: ["dist/index.js"],
    import: "{ HttpNotFound, HttpInternalServerError }",
    limit: "530B",
  },
  {
    name: "ESM (only isHttpException)",
    path: ["dist/index.js"],
    import: "{ isHttpException }",
    limit: "482B",
  },
  {
    name: "ESM (only createHttpException)",
    path: ["dist/index.js"],
    import: "{ createHttpException }",
    limit: "1141B",
  },
  {
    name: "ESM (createHttpException + isHttpException)",
    path: ["dist/index.js"],
    import: "{ createHttpException, isHttpException }",
    limit: "1170B",
  },
  {
    name: "ESM (createHttpException + isHttpException + isHttpClientException )",
    path: ["dist/index.js"],
    import: "{ createHttpException, isHttpException, isHttpClientException }",
    limit: "1183B",
  },
  {
    name: "ESM serializer ({ toJson })",
    path: ["dist/serializer/index.js"],
    import: "{ toJson }",
    limit: "1011B",
  },
  {
    name: "ESM serializer ({ fromJson })",
    path: ["dist/serializer/index.js"],
    import: "{ fromJson }",
    limit: "1647B",
  },
  {
    name: "ESM all serializer ({ fromJson, toJson, convertToSerializable, createFromSerializable })",
    path: ["dist/serializer/index.js"],
    import:
      "{ fromJson, toJson, createFromSerializable, convertToSerializable }",
    limit: "2058B",
  },
  {
    name: "ESM experimental ({ tryOrFail })",
    path: ["dist/experimental/index.js"],
    import: "{ tryOrFail }",
    limit: "1264B",
  },
] satisfies SizeLimitConfig;

export default config;
