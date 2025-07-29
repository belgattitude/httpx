import { createStableKeyOrThrow } from '@httpx/stable-hash';
export type CacheStringKey = string & {
  _brand: 'x-mem-cache-string-key';
};

export type CacheKeyTuple<T = unknown> = [string, ...T[]];

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
export const genCacheKeyString = <TKey extends CacheKeyTuple>(params: {
  key: TKey;
  namespace?: string | undefined;
}): CacheStringKey => {
  const { key, namespace } = params;
  assertValidCacheKeyTuple(key);
  return createStableKeyOrThrow(
    {
      ...(namespace ? { ns: namespace } : {}),
      key,
    },
    {
      sortArrayValues: false,
    }
  ) as CacheStringKey;
};

export const isValidCacheKeyTuple = (v: unknown): v is CacheKeyTuple => {
  if (Array.isArray(v) && v.length > 0) {
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
