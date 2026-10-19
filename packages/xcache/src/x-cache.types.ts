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
  key: CacheKeyTuple;
  fn: (key: CacheKeyTuple) => Awaited<ReturnType<TFunction>>;
  namespace?: string;
  ttl?: number;
}
