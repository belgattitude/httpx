import type { SupportedCacheValues } from '@httpx/lru';

import type { CacheKeyTuple } from './cache-key';

type CacheableValues = SupportedCacheValues;

export type CacheableAsyncFunction = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => Promise<CacheableValues>;

export interface XCacheRunAsyncParams<
  TFunction extends CacheableAsyncFunction,
> {
  key: CacheKeyTuple;
  fn: (key: CacheKeyTuple) => Awaited<ReturnType<TFunction>>;
  namespace?: string;
  ttl?: number;
}
