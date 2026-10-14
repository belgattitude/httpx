import { beforeEach, describe, expect, it, vi } from "vitest";

import { LruCache, type LruCacheParams } from "../../lru-cache";
import { getOrCreateLruCache } from "../get-or-create-lru-cache";

describe("getOrCreateLruCache()", () => {
  beforeEach(() => {
    // Reset the singleton registry to avoid test cross-contamination
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).__httpx_lru_cache_instances = undefined;
    vi.restoreAllMocks();
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it("creates a cache when none exists yet and stores it in the global registry", () => {
    const params: LruCacheParams<string> = { maxSize: 2 };

    const cache = getOrCreateLruCache("default", params);

    expect(cache).toBeInstanceOf(LruCache);
    expect(globalThis.__httpx_lru_cache_instances).toBeInstanceOf(Map);
    expect(globalThis.__httpx_lru_cache_instances!.has("default")).toBe(true);
    // The stored instance is the same one we received
    expect(globalThis.__httpx_lru_cache_instances!.get("default")).toBe(cache);
  });

  it("returns the same instance for the same name and does not call onCreate again", () => {
    const onCreate = vi.fn<(name: string, params: unknown) => void>();
    const params1: LruCacheParams<string> = { maxSize: 1 };
    const params2: LruCacheParams<string> = { maxSize: 9999 };

    const first = getOrCreateLruCache("singleton", params1, { onCreate });
    const second = getOrCreateLruCache("singleton", params2, { onCreate });

    expect(first).toBe(second);
    // onCreate is called only once, with the original params
    expect(onCreate).toHaveBeenCalledExactlyOnceWith("singleton", params1);
  });

  it("creates distinct instances for different names", () => {
    const paramsA: LruCacheParams<string> = { maxSize: 3 };
    const paramsB: LruCacheParams<string> = { maxSize: 4 };

    const a1 = getOrCreateLruCache("A", paramsA);
    const b1 = getOrCreateLruCache("B", paramsB);

    expect(a1).not.toBe(b1);
    expect(globalThis.__httpx_lru_cache_instances!.get("A")).toBe(a1);
    expect(globalThis.__httpx_lru_cache_instances!.get("B")).toBe(b1);
  });

  it("invokes options.onCreate exactly once when creating a new named cache", () => {
    const onCreate = vi.fn<(name: string, params: unknown) => void>();
    const params: LruCacheParams<string> = { maxSize: 2 };

    const c1 = getOrCreateLruCache("with-callback", params, { onCreate });
    const c2 = getOrCreateLruCache(
      "with-callback",
      { maxSize: 5 },
      { onCreate }
    );

    expect(c1).toBe(c2);
    expect(onCreate).toHaveBeenCalledExactlyOnceWith("with-callback", params);
  });
});
