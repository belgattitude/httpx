import type { SupportedCacheValues } from '@httpx/lru';

type CacheableValues = SupportedCacheValues;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CacheableAsyncFunction = (
  ...args: any[]
) => Promise<CacheableValues>;

export type XCacheRunAsyncParams<TFunction extends CacheableAsyncFunction> = {
  key: unknown[];
  fn: TFunction;
  ttl?: number;
};
