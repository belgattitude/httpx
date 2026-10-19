import type { SupportedCacheValues } from "@httpx/lru";

import type { CacheKeyTuple } from "./cache-key";

type CacheableValues = SupportedCacheValues;

/**
 * Async function whose result can be cached.
 */
export type CacheableAsyncFunction = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => Promise<CacheableValues>;

/**
 * Parameters of a cached async function run.
 */
export interface XCacheRunAsyncParams<
  TFunction extends CacheableAsyncFunction,
> {
  /** Cache key, first element must be a non-empty string */
  key: CacheKeyTuple;
  /** Function executed on cache miss */
  fn: (key: CacheKeyTuple) => Awaited<ReturnType<TFunction>>;
  /** Override the default namespace */
  namespace?: string;
  /** Time to live in milliseconds */
  ttl?: number;
}
