import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TimeLruCache, type TimeLruCacheParams } from '../../time-lru-cache';
import { getOrCreateTimeLruCache } from '../get-or-create-time-lru-cache';

// Ensure type of the global registry matches expectations
// declared in get-or-create-lru-cache.ts via declare global

declare global {
  // eslint-disable-next-line no-var
  var __httpx_time_lru_cache_instances:
    | Map<string, TimeLruCache<any, any>>
    | undefined;
}

describe('getOrCreateTimeLruCache()', () => {
  beforeEach(() => {
    // Reset the singleton registry to avoid test cross-contamination
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).__httpx_time_lru_cache_instances = undefined;
    vi.restoreAllMocks();
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it('creates a cache when none exists yet and stores it in the global registry', () => {
    const params: TimeLruCacheParams<string> = { maxSize: 2, defaultTTL: 3000 };

    const cache = getOrCreateTimeLruCache('default', params);

    expect(cache).toBeInstanceOf(TimeLruCache);
    expect(globalThis.__httpx_time_lru_cache_instances).toBeInstanceOf(Map);
    expect(globalThis.__httpx_time_lru_cache_instances!.has('default')).toBe(
      true
    );
    // The stored instance is the same one we received
    expect(globalThis.__httpx_time_lru_cache_instances!.get('default')).toBe(
      cache
    );
  });

  it('returns the same instance for the same name and does not call onCreate again', () => {
    const onCreate = vi.fn();
    const params1: TimeLruCacheParams<string> = {
      maxSize: 1,
      defaultTTL: 3000,
    };
    const params2: TimeLruCacheParams<string> = {
      maxSize: 9999,
      defaultTTL: 3000,
    };

    const first = getOrCreateTimeLruCache('singleton', params1, { onCreate });
    const second = getOrCreateTimeLruCache('singleton', params2, { onCreate });

    expect(first).toBe(second);
    // onCreate is called only once, with the original params
    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(onCreate).toHaveBeenCalledWith('singleton', params1);
  });

  it('creates distinct instances for different names', () => {
    const paramsA: TimeLruCacheParams<string> = {
      maxSize: 3,
      defaultTTL: 3000,
    };
    const paramsB: TimeLruCacheParams<string> = {
      maxSize: 4,
      defaultTTL: 3000,
    };

    const a1 = getOrCreateTimeLruCache('A', paramsA);
    const b1 = getOrCreateTimeLruCache('B', paramsB);

    expect(a1).not.toBe(b1);
    expect(globalThis.__httpx_time_lru_cache_instances!.get('A')).toBe(a1);
    expect(globalThis.__httpx_time_lru_cache_instances!.get('B')).toBe(b1);
  });

  it('invokes options.onCreate exactly once when creating a new named cache', () => {
    const onCreate = vi.fn();
    const params: TimeLruCacheParams<string> = { maxSize: 2, defaultTTL: 3000 };

    const c1 = getOrCreateTimeLruCache('with-callback', params, { onCreate });
    const c2 = getOrCreateTimeLruCache(
      'with-callback',
      { maxSize: 5, defaultTTL: 3000 },
      { onCreate }
    );

    expect(c1).toBe(c2);
    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(onCreate).toHaveBeenCalledWith('with-callback', params);
  });
});
