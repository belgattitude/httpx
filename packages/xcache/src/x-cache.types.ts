import type { SupportedCacheValues } from '@httpx/lru';

type CacheableValues = SupportedCacheValues;

export type CacheableAsyncFunction = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => Promise<CacheableValues>;

export type XCacheRunAsyncParams<TFunction extends CacheableAsyncFunction> = {
  key: unknown[];
  fn: TFunction;
  ttl?: number;
};
