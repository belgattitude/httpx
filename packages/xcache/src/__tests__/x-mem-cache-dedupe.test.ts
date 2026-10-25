import { TimeLruCache } from "@httpx/lru";
import { expect, vi } from "vitest";

import { CacheCompress } from "../compress/cache-compress";
import { JsonSerializer } from "../serializer/json-serializer";
import { XMemCache, type XMemCacheOptions } from "../x-mem-cache";

const payload = {
  rows: Array.from({ length: 500 }, (_, i) => {
    return { id: i, name: `Item ${i}` };
  }),
};

/**
 * A function resolving (or rejecting) when the test decides to.
 */
const createDeferredFn = () => {
  const { promise, resolve, reject } = Promise.withResolvers<typeof payload>();
  const fn = vi.fn<() => Promise<typeof payload>>(() => promise);
  return {
    fn,
    resolve: (value: typeof payload = payload) => resolve(value),
    reject: (error: Error) => reject(error),
  };
};

const createCache = (options: Omit<XMemCacheOptions, "lru"> = {}) => {
  const lru = new TimeLruCache({ maxSize: 50, defaultTTL: 10_000 });
  const cache = new XMemCache({ lru, ...options });
  return { cache, lru };
};

describe("XMemCache dedupe", () => {
  it("should execute the function once for concurrent calls", async () => {
    const { cache, lru } = createCache();
    const { fn, resolve } = createDeferredFn();
    const calls = Array.from({ length: 5 }, () =>
      cache.runAsync({ key: ["/data"], fn })
    );
    resolve();
    const results = await Promise.all(calls);
    expect(fn).toHaveBeenCalledOnce();
    expect(lru.size).toBe(1);
    const [first, ...others] = results;
    expect(first?.meta.cached).toBe(false);
    expect(first?.meta.deduped).toBeUndefined();
    for (const { data, meta } of others) {
      expect(data).toBe(payload);
      expect(meta).toStrictEqual({
        cached: false,
        deduped: true,
        generatedKey: first?.meta.generatedKey,
        // shared execution: same duration
        duration: first?.meta.duration,
      });
    }
    // subsequent calls are cache hits
    const { meta } = await cache.runAsync({ key: ["/data"], fn });
    expect(meta.cached).toBe(true);
    expect(meta.deduped).toBeUndefined();
  });

  it("should not dedupe calls with different keys or namespaces", async () => {
    const { cache } = createCache();
    const fn = vi.fn<() => Promise<typeof payload>>(() =>
      Promise.resolve(payload)
    );
    await Promise.all([
      cache.runAsync({ key: ["/data", { id: 1 }], fn }),
      cache.runAsync({ key: ["/data", { id: 2 }], fn }),
      cache.runAsync({ key: ["/data", { id: 1 }], fn, namespace: "other" }),
    ]);
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("should dedupe with compression", async () => {
    const { cache } = createCache({
      compressor: new CacheCompress({
        algorithm: "gzip",
        serializer: new JsonSerializer(),
        minimumByteSaving: 0,
        minimumStringLength: 0,
      }),
    });
    const { fn, resolve } = createDeferredFn();
    const calls = [
      cache.runAsync({ key: ["/data"], fn }),
      cache.runAsync({ key: ["/data"], fn }),
    ];
    resolve();
    const [a, b] = await Promise.all(calls);
    expect(fn).toHaveBeenCalledOnce();
    expect(a?.data).toStrictEqual(payload);
    expect(b?.data).toStrictEqual(payload);
    expect(b?.meta.deduped).toBe(true);
    expect(b?.meta.compression).toStrictEqual(a?.meta.compression);
  });

  it("should reject all the callers and retry on the next call", async () => {
    const { cache, lru } = createCache();
    const { fn, reject } = createDeferredFn();
    const calls = [
      cache.runAsync({ key: ["/data"], fn }),
      cache.runAsync({ key: ["/data"], fn }),
    ];
    const error = new Error("fetch failed");
    reject(error);
    const results = await Promise.allSettled(calls);
    expect(results).toStrictEqual([
      { status: "rejected", reason: error },
      { status: "rejected", reason: error },
    ]);
    expect(fn).toHaveBeenCalledOnce();
    expect(lru.size).toBe(0);
    const { meta } = await cache.runAsync({
      key: ["/data"],
      fn: () => Promise.resolve(payload),
    });
    expect(meta.cached).toBe(false);
    expect(meta.deduped).toBeUndefined();
  });

  it("should not dedupe when disabled globally", async () => {
    const { cache } = createCache({ dedupe: false });
    const fn = vi.fn<() => Promise<typeof payload>>(() =>
      Promise.resolve(payload)
    );
    const results = await Promise.all([
      cache.runAsync({ key: ["/data"], fn }),
      cache.runAsync({ key: ["/data"], fn }),
    ]);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(results.map(({ meta }) => meta.deduped)).toStrictEqual([
      undefined,
      undefined,
    ]);
  });

  it("should not dedupe a call disabling it", async () => {
    const { cache } = createCache();
    const fn = vi.fn<() => Promise<typeof payload>>(() =>
      Promise.resolve(payload)
    );
    await Promise.all([
      cache.runAsync({ key: ["/data"], fn }),
      cache.runAsync({ key: ["/data"], fn, dedupe: false }),
    ]);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should dedupe a call enabling it when disabled globally", async () => {
    const { cache } = createCache({ dedupe: false });
    const fn = vi.fn<() => Promise<typeof payload>>(() =>
      Promise.resolve(payload)
    );
    const [, b] = await Promise.all([
      cache.runAsync({ key: ["/data"], fn, dedupe: true }),
      cache.runAsync({ key: ["/data"], fn, dedupe: true }),
    ]);
    expect(fn).toHaveBeenCalledOnce();
    expect(b?.meta.deduped).toBe(true);
  });

  it("should never dedupe bypassed calls", async () => {
    const { cache, lru } = createCache({ enabled: false });
    const fn = vi.fn<() => Promise<typeof payload>>(() =>
      Promise.resolve(payload)
    );
    const results = await Promise.all([
      cache.runAsync({ key: ["/data"], fn }),
      cache.runAsync({ key: ["/data"], fn }),
    ]);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(lru.size).toBe(0);
    for (const { meta } of results) {
      expect(meta.bypassed).toBe(true);
      expect(meta.deduped).toBeUndefined();
    }
  });

  it("should not let a forced revalidation wait for an in-flight execution", async () => {
    const { cache } = createCache();
    const stale = createDeferredFn();
    const fresh = createDeferredFn();
    const first = cache.runAsync({ key: ["/data"], fn: stale.fn });
    const forced = cache.runAsync({
      key: ["/data"],
      fn: fresh.fn,
      forceRevalidate: true,
    });
    // waits for the forced revalidation, the most recent execution
    const next = cache.runAsync({ key: ["/data"], fn: stale.fn });
    const freshPayload = { rows: [] };
    fresh.resolve(freshPayload);
    stale.resolve();
    const [a, b, c] = await Promise.all([first, forced, next]);
    expect(stale.fn).toHaveBeenCalledOnce();
    expect(fresh.fn).toHaveBeenCalledOnce();
    expect(a.data).toBe(payload);
    expect(b.data).toBe(freshPayload);
    expect(b.meta.deduped).toBeUndefined();
    expect(c.data).toBe(freshPayload);
    expect(c.meta.deduped).toBe(true);
  });

  it("should keep the replacing execution when the replaced one settles", async () => {
    const { cache } = createCache();
    const stale = createDeferredFn();
    const fresh = createDeferredFn();
    const first = cache.runAsync({ key: ["/data"], fn: stale.fn });
    const forced = cache.runAsync({
      key: ["/data"],
      fn: fresh.fn,
      forceRevalidate: true,
    });
    // nothing stored, the next call must wait for the forced revalidation
    stale.reject(new Error("stale failed"));
    await expect(first).rejects.toThrow("stale failed");
    const fn = vi.fn<() => Promise<typeof payload>>(() =>
      Promise.resolve(payload)
    );
    const waiting = cache.runAsync({ key: ["/data"], fn });
    const freshPayload = { rows: [] };
    fresh.resolve(freshPayload);
    const [, { data, meta }] = await Promise.all([forced, waiting]);
    expect(fn).not.toHaveBeenCalled();
    expect(data).toBe(freshPayload);
    expect(meta.deduped).toBe(true);
  });

  it("should dedupe runAsyncEntry calls", async () => {
    const { cache } = createCache();
    const { fn, resolve } = createDeferredFn();
    const calls = [
      cache.runAsyncEntry({ key: ["/data"], fn }),
      cache.runAsync({ key: ["/data"], fn }),
      cache.runAsyncEntry({ key: ["/data"], fn }),
    ] as const;
    resolve();
    const [a, b, c] = await Promise.all(calls);
    expect(fn).toHaveBeenCalledOnce();
    expect(a.deduped).toBe(false);
    expect(a.cached).toBe(false);
    expect(b.meta.deduped).toBe(true);
    expect(c.deduped).toBe(true);
    expect(c.entry).toBe(a.entry);
    expect(c.expiresIn).toBeGreaterThan(0);
  });

  it("should not dedupe calls with different origins", async () => {
    const { cache } = createCache();
    const fn = vi.fn<() => Promise<typeof payload>>(() =>
      Promise.resolve(payload)
    );
    await Promise.all([
      cache.runAsync({ key: ["/data"], fn }),
      cache.runAsync({ key: ["/data"], fn, origin: "hono" }),
    ]);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
