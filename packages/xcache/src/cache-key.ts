import { createStableKeyOrThrow } from "@httpx/stable-hash";

export type CacheStringKey = string & {
  _brand: "x-mem-cache-string-key";
};

export type CacheKeyTuple<T = unknown> = [string, ...T[]];

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

export function assertValidCacheKeyTuple(
  v: unknown
): asserts v is CacheKeyTuple {
  if (!isValidCacheKeyTuple(v)) {
    throw new TypeError(`Invalid cache key type`);
  }
}

/**
 * Generates a stable cache key string based on the provided parameters.
 *
 * @param params - The parameters to generate the cache key.
 * @param params.key - The key components to be used for generating the cache key.
 * @param params.namespace - An optional namespace to prefix the cache key.
 * @returns A stable cache key string.
 *
 * @throws TypeError if the key is not a valid key.
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
 * The output is equivalent to `createStableKeyOrThrow({ compressorId, key, ns })`
 * (object keys sorted), but built by concatenation to avoid sorting and
 * re-serializing the wrapper object on every call (hot path on cache hits).
 *
 * @param params - The parameters to generate the cache key.
 * @param params.key - The key components to be used for generating the cache key.
 * @param params.namespace - An optional namespace to prefix the cache key.
 * @returns A stable cache key string.
 *
 * @throws TypeError if the key is not a valid key.
 */
export const genCacheKeyString = <TKey extends CacheKeyTuple>(params: {
  key: TKey;
  namespace?: string | undefined;
  compressorId?: string | undefined;
}): CacheStringKey => {
  const { key, namespace, compressorId } = params;
  assertValidCacheKeyTuple(key);
  const compressorPart =
    compressorId !== undefined && compressorId !== ""
      ? `"compressorId":${JSON.stringify(compressorId)},`
      : "";
  const nsPart =
    namespace !== undefined && namespace !== ""
      ? `,"ns":${JSON.stringify(namespace)}`
      : "";
  return `{${compressorPart}"key":${stringifyKeyTuple(key)}${nsPart}}` as CacheStringKey;
};
