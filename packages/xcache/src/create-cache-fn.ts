import { XMemCache, type XMemCacheOptions } from "./x-mem-cache";

/**
 * Create a cached runAsync function bound to a new XMemCache instance.
 *
 * @example
 * ```typescript
 * const runAsync = createCacheFn({ lru: new TimeLruCache({ maxSize: 50, defaultTTL: 5000 }) });
 * const { data } = await runAsync({ key: ['/api/data'], fn: () => fetchData() });
 * ```
 */
export const createCacheFn = (options: XMemCacheOptions) =>
  new XMemCache(options).runAsync;
