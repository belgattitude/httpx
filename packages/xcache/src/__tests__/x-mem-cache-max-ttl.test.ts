import { Hono } from "hono";
import { expect, onTestFinished, vi } from "vitest";

import { CacheCompress } from "../compress/cache-compress";
import { createHonoXCache } from "../hono/create-hono-xcache";
import { JsonSerializer } from "../serializer/json-serializer";
import { XMemCache, type XMemCacheLruOptions } from "../x-mem-cache";

const bigPayload = {
  rows: Array.from({ length: 500 }, (_, i) => {
    return { id: i, name: `Item ${i}` };
  }),
};

const createCache = (lru: Partial<XMemCacheLruOptions> = {}) =>
  new XMemCache({
    lru: { maxSize: 50, defaultTTL: 60_000, maxTTL: 50, ...lru },
    compressor: new CacheCompress({
      algorithm: "gzip",
      serializer: new JsonSerializer(),
      minimumByteSaving: 0,
      minimumStringLength: 0,
    }),
  });

describe("XMemCache lru maxTTL", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(0);
    onTestFinished(() => {
      vi.useRealTimers();
    });
  });

  it("should cap the default ttl and the ttl given to runAsync", async () => {
    const cache = createCache();
    const fn = () => Promise.resolve(bigPayload);
    await cache.runAsync({ key: ["/default"], fn });
    await cache.runAsync({ key: ["/longer"], fn, ttl: 10_000 });
    // shorter ttls are kept
    await cache.runAsync({ key: ["/shorter"], fn, ttl: 20 });
    expect(
      cache.getStats().entries.map(({ expiresIn, expiresAt }) => {
        return { expiresIn, expiresAt };
      })
    ).toStrictEqual([
      { expiresIn: 50, expiresAt: 50 },
      { expiresIn: 50, expiresAt: 50 },
      { expiresIn: 20, expiresAt: 20 },
    ]);
  });

  it("should still create entries as usual (compressed), then expire them", async () => {
    const cache = createCache();
    const fn = vi.fn<() => Promise<typeof bigPayload>>(() =>
      Promise.resolve(bigPayload)
    );
    const miss = await cache.runAsync({ key: ["/a"], fn, ttl: 10_000 });
    expect(miss.meta.cached).toBe(false);
    expect(miss.meta.compression?.algorithm).toBe("gzip");
    vi.setSystemTime(40);
    const hit = await cache.runAsync({ key: ["/a"], fn, ttl: 10_000 });
    expect(hit.meta.cached).toBe(true);
    expect(hit.data).toStrictEqual(bigPayload);
    vi.setSystemTime(51);
    const expired = await cache.runAsync({ key: ["/a"], fn, ttl: 10_000 });
    expect(expired.meta.cached).toBe(false);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should not change the ttl when not set", async () => {
    const cache = createCache({ maxTTL: undefined });
    await cache.runAsync({
      key: ["/a"],
      fn: () => Promise.resolve(1),
      ttl: 10_000,
    });
    expect(cache.getEntryInfo({ key: ["/a"] })?.expiresIn).toBe(10_000);
    expect(cache.getConfig()).not.toHaveProperty("maxTTL");
  });

  it("should throw on an invalid maxTTL", () => {
    expect(() => createCache({ maxTTL: 0 })).toThrow("Invalid maxTTL");
  });

  it("should return maxTTL in the config", () => {
    const { ttl, maxTTL } = createCache().getConfig();
    expect({ ttl, maxTTL }).toStrictEqual({ ttl: 60_000, maxTTL: 50 });
  });

  it("should cap the hono Cache-Control max-age based on the ttl", async () => {
    const xcache = createHonoXCache({
      lru: { maxSize: 50, defaultTTL: 60_000, maxTTL: 2000 },
      cacheControl: { maxAge: "ttl" },
    });
    const app = new Hono();
    app.get("/data", (c) =>
      xcache.json(c, {
        key: ["/data"],
        fn: () => Promise.resolve({ id: 1 }),
        ttl: 30_000,
      })
    );
    const res = await app.request("/data");
    expect(res.headers.get("Cache-Control")).toBe("private, max-age=2");
  });
});
