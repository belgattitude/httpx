import { createStableKeyOrThrow } from "@httpx/stable-hash";

/**
 * Generated cache key string (stable serialization of namespace, compressor
 * identifier and key tuple).
 */
export type CacheStringKey = string & {
  _brand: "x-mem-cache-string-key";
};

/**
 * Cache key provided to runAsync, the first element must be a non-empty
 * string (ie: ['/api/user', { id: 1 }]).
 */
export type CacheKeyTuple<T = unknown> = [string, ...T[]];

/**
 * Typeguard to check if a value is a valid cache key tuple.
 */
export const isValidCacheKeyTuple = (v: unknown): v is CacheKeyTuple => {
  if (
    Array.isArray(v) &&
    v.length > 0 &&
    typeof v[0] === "string" &&
    v[0].length > 0
  ) {
    return true;
  }
  return false;
};

/**
 * Assert that a value is a valid cache key tuple.
 *
 * @throws TypeError if the value is not a valid cache key tuple.
 */
export function assertValidCacheKeyTuple(
  v: unknown
): asserts v is CacheKeyTuple {
  if (!isValidCacheKeyTuple(v)) {
    throw new TypeError(`Invalid cache key type`);
  }
}

/**
 * Whether a key part can be stringified with JSON.stringify and give the same
 * result as createStableKeyOrThrow (string, number, boolean or null).
 */
const isPrimitiveKeyPart = (v: unknown): boolean => {
  const t = typeof v;
  return t === "string" || t === "number" || t === "boolean" || v === null;
};

/**
 * Stable serialization of the key tuple (array order is preserved).
 * Fast path for tuples made of primitives only (most common case),
 * where JSON.stringify gives the same result as createStableKeyOrThrow.
 */
const stringifyKeyTuple = (key: CacheKeyTuple): string =>
  key.every(isPrimitiveKeyPart)
    ? JSON.stringify(key)
    : createStableKeyOrThrow(key, { sortArrayValues: false });

/**
 * Generates a stable cache key string based on the provided parameters.
 *
 * The output is equivalent to `createStableKeyOrThrow({ compressorId, key, ns, origin })`
 * (object keys sorted), but built by concatenation to avoid sorting and
 * re-serializing the wrapper object on every call (hot path on cache hits).
 *
 * @param params - The parameters to generate the cache key.
 * @param params.key - The key components to be used for generating the cache key.
 * @param params.namespace - An optional namespace to prefix the cache key.
 * @param params.compressorId - An optional compressor identifier.
 * @param params.origin - An optional origin (ie: "hono") to separate the keys
 * created by integrations from the ones created by XMemCache.runAsync.
 * @returns A stable cache key string.
 *
 * @throws TypeError if the key is not a valid key.
 */
export const genCacheKeyString = <TKey extends CacheKeyTuple>(params: {
  key: TKey;
  namespace?: string | undefined;
  compressorId?: string | undefined;
  origin?: string | undefined;
}): CacheStringKey => {
  const { key, namespace, compressorId, origin } = params;
  assertValidCacheKeyTuple(key);
  const compressorPart =
    compressorId !== undefined && compressorId !== ""
      ? `"compressorId":${JSON.stringify(compressorId)},`
      : "";
  const nsPart =
    namespace !== undefined && namespace !== ""
      ? `,"ns":${JSON.stringify(namespace)}`
      : "";
  const originPart =
    origin !== undefined && origin !== ""
      ? `,"origin":${JSON.stringify(origin)}`
      : "";
  return `{${compressorPart}"key":${stringifyKeyTuple(key)}${nsPart}${originPart}}` as CacheStringKey;
};
