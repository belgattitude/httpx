import type { SizeLimitConfig } from 'size-limit';

const fullEsmMaxSize = '1950B';
const fullCjsMaxSize = '2500B';

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
    name: 'ESM (import everything *)',
    path: ['dist/index.mjs'],
    import: '*',
    limit: fullEsmMaxSize,
  },
  {
    name: 'ESM (only HttpException exception)',
    path: ['dist/index.mjs'],
    import: '{ HttpException }',
    limit: '360B',
  },
  {
    name: 'ESM (only HttpClientException exception)',
    path: ['dist/index.mjs'],
    import: '{ HttpClientException }',
    limit: '390B',
  },
  {
    name: 'ESM (only HttpNotFound exception)',
    path: ['dist/index.mjs'],
    import: '{ HttpNotFound }',
    limit: '425B',
  },
  {
    name: 'ESM (2 client exceptions: HttpNotFound + HttpRequestTimeout)',
    path: ['dist/index.mjs'],
    import: '{ HttpNotFound, HttpRequestTimeout }',
    limit: '447B',
  },
  {
    name: 'ESM (6 client exceptions: NotFound + RequestTimeout + HttpConflict...)',
    path: ['dist/index.mjs'],
    import:
      '{ HttpNotFound, HttpRequestTimeout, HttpConflict, HttpGone, HttpMethodNotAllowed, HttpForbidden }',
    limit: '515B',
  },
  {
    name: 'ESM (1 client and 1 server exception)',
    path: ['dist/index.mjs'],
    import: '{ HttpNotFound, HttpInternalServerError }',
    limit: '460B',
  },
  {
    name: 'ESM (only isHttpException)',
    path: ['dist/index.mjs'],
    import: '{ isHttpException }',
    limit: '392B',
  },
  {
    name: 'ESM (only createHttpException)',
    path: ['dist/index.mjs'],
    import: '{ createHttpException }',
    limit: '1240B', // Will import all server/client exceptions
  },
  {
    name: 'ESM (createHttpException + isHttpException)',
    path: ['dist/index.mjs'],
    import: '{ createHttpException, isHttpException }',
    limit: '1260B',
  },
  {
    name: 'ESM (createHttpException + isHttpException + isHttpClientException )',
    path: ['dist/index.mjs'],
    import: '{ createHttpException, isHttpException, isHttpClientException }',
    limit: '1271B',
  },
  {
    name: 'ESM serializer ({ toJson })',
    path: ['dist/serializer/index.mjs'],
    import: '{ toJson }',
    limit: '920B',
  },
  {
    name: 'ESM serializer ({ fromJson })',
    path: ['dist/serializer/index.mjs'],
    import: '{ fromJson }',
    limit: '1740B',
  },
  {
    name: 'ESM all serializer ({ fromJson, toJson, convertToSerializable, createFromSerializable })',
    path: ['dist/serializer/index.mjs'],
    import:
      '{ fromJson, toJson, createFromSerializable, convertToSerializable }',
    limit: '2030B',
  },
  {
    name: 'ESM experimental ({ tryOrFail })',
    path: ['dist/experimental/index.mjs'],
    import: '{ tryOrFail }',
    limit: '1400B',
  },
  // ###################################################
  // Commonjs full bundle
  // ###################################################
  {
    name: 'CJS (require everything *)',
    path: ['dist/index.cjs'],
    import: '*',
    webpack: true,
    limit: fullCjsMaxSize,
  },
  {
    name: 'CJS (only isHttpException)',
    path: ['dist/index.cjs'],
    import: '{ isHttpException }',
    webpack: true,
    limit: '1750B',
  },
] satisfies SizeLimitConfig;
