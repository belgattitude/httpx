import { XMemCache, type XMemCacheOptions } from './x-mem-cache';

export const createCacheFn = (options: XMemCacheOptions) => {
  return new XMemCache(options).runAsync;
};
