import type { SupportedCacheValues } from '@httpx/lru';

import type { CacheKeyTuple } from './cache-key';

type CacheableValues = SupportedCacheValues;

export type CacheableAsyncFunction = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => Promise<CacheableValues>;

export type XCacheRunAsyncResult<TFunction extends CacheableAsyncFunction> = {
  data: Awaited<ReturnType<TFunction>>;
  meta: {
    cached: boolean;
    cacheKey: string;
  };
};

type KeyTuple<TFunction> = [
  string,
  ...(TFunction extends (...args: infer P) => unknown ? P : never),
];

type TestFnParams = {
  name: string;
};
const fetchDataFn = async (params: TestFnParams) => {
  return {
    message: `Hello ${params.name}`,
  };
};

export interface XCacheRunAsyncParamsBackup<
  TFunction extends CacheableAsyncFunction,
> {
  key: CacheKeyTuple;
  fn: TFunction;
  namespace?: string;
  ttl?: number;
}

export interface XCacheRunAsyncParams<
  TFunction extends CacheableAsyncFunction,
> {
  key: CacheKeyTuple;
  fn: (key: CacheKeyTuple) => Awaited<ReturnType<TFunction>>;
  namespace?: string;
  ttl?: number;
}

export type CacheableAsyncFunction2 = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => Promise<unknown>;

/*
export const withCache = async <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TFunction extends (...args: any[]) => Promise<any>,
>(params: {
  fn: TFunction;
  key: unknown[];
}): Promise<Awaited<ReturnType<TFunction>>> => {
  const { fn } = params;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return await fn();
};
*/

// export const withCache = async <TResult, TKey extends unknown[]>(params: {
export const withCache = async <TResult, TKey extends CacheKeyTuple>(params: {
  key: TKey;
  fn: (params: { key: TKey }) => Promise<TResult>;
}): Promise<{ data: TResult; meta: { cached: boolean } }> => {
  const { fn, key } = params;
  return {
    data: await fn({ key }),
    meta: {
      cached: true,
    },
  };
};

export const createAsyncCache = () => {
  return withCache;
};
