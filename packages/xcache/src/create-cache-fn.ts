import { XMemCache, type XMemCacheOptions } from "./x-mem-cache";

export const createCacheFn = (options: XMemCacheOptions) =>
  new XMemCache(options).runAsync;
