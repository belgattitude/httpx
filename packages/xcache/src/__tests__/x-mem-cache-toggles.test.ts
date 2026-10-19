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

const createCache = (
  options: Omit<XMemCacheOptions, "lru" | "compressor"> = {},
  lru = new TimeLruCache({ maxSize: 50, defaultTTL: 10_000 })
) => {
  const cache = new XMemCache({
    lru,
    compressor: new CacheCompress({
      algorithm: "gzip",
      serializer: new JsonSerializer(),
      minimumByteSaving: 0,
    }),
    ...options,
  });
  const fn = vi.fn<() => Promise<typeof payload>>(() =>
    Promise.resolve(payload)
  );
  return { cache, lru, fn };
};

describe("XMemCache enable / disable", () => {
  describe("cache", () => {
    it("should be enabled by default", () => {
      const { cache } = createCache();
      expect(cache.enabled).toBe(true);
      expect(cache.compressionEnabled).toBe(true);
    });

    it("should bypass the cache when disabled globally", async () => {
      const { cache, lru, fn } = createCache({ enabled: false });
      expect(cache.enabled).toBe(false);
      for (let i = 0; i < 2; i++) {
        const { data, meta } = await cache.runAsync({ key: ["/data"], fn });
        expect(data).toStrictEqual(payload);
        expect(meta.cached).toBe(false);
        expect(meta.bypassed).toBe(true);
        expect(meta.compression).toBeUndefined();
      }
      expect(fn).toHaveBeenCalledTimes(2);
      expect(lru.size).toBe(0);
    });

    it("should bypass the cache for a single call", async () => {
      const { cache, lru, fn } = createCache();
      await cache.runAsync({ key: ["/data"], fn });
      const { meta } = await cache.runAsync({
        key: ["/data"],
        fn,
        enabled: false,
      });
      expect(meta.bypassed).toBe(true);
      expect(fn).toHaveBeenCalledTimes(2);
      // the existing entry is left untouched
      expect(lru.size).toBe(1);
      const { meta: hitMeta } = await cache.runAsync({ key: ["/data"], fn });
      expect(hitMeta.cached).toBe(true);
      expect(hitMeta.bypassed).toBeUndefined();
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it("should enable the cache for a single call when disabled globally", async () => {
      const { cache, lru, fn } = createCache({ enabled: false });
      await cache.runAsync({ key: ["/data"], fn, enabled: true });
      const { meta } = await cache.runAsync({
        key: ["/data"],
        fn,
        enabled: true,
      });
      expect(meta.cached).toBe(true);
      expect(fn).toHaveBeenCalledOnce();
      expect(lru.size).toBe(1);
    });

    it("should return expiresIn in runAsyncEntry", async () => {
      vi.useFakeTimers({ toFake: ["Date"] });
      vi.setSystemTime(0);
      try {
        const { cache, fn } = createCache();
        const miss = await cache.runAsyncEntry({
          key: ["/data"],
          fn,
          ttl: 5000,
        });
        expect(miss.expiresIn).toBe(5000);
        vi.setSystemTime(1000);
        const hit = await cache.runAsyncEntry({ key: ["/data"], fn });
        expect(hit.cached).toBe(true);
        expect(hit.expiresIn).toBe(4000);
      } finally {
        vi.useRealTimers();
      }
    });

    it("should return bypassed in runAsyncEntry", async () => {
      const { cache, fn } = createCache({ enabled: false });
      const result = await cache.runAsyncEntry({ key: ["/data"], fn });
      expect(result.expiresIn).toBeUndefined();
      expect(result.bypassed).toBe(true);
      expect(result.cached).toBe(false);
      expect(result.entry.format).toBe("native");
      expect(result.entry.data).toStrictEqual(payload);
    });
  });

  describe("compression", () => {
    it("should store entries as-is when compression is disabled globally", async () => {
      const { cache, fn } = createCache({ compressionEnabled: false });
      expect(cache.compressionEnabled).toBe(false);
      const first = await cache.runAsync({ key: ["/data"], fn });
      expect(first.meta.compression).toBeUndefined();
      // same cache keys as with compression
      expect(first.meta.generatedKey).toBe(
        '{"compressorId":"cache-compress:json","key":["/data"],"ns":"default"}'
      );
      expect(cache.getEntryInfo({ key: ["/data"] })).toMatchObject({
        format: "native",
        skippedReason: "compression_disabled",
      });
      const second = await cache.runAsync({ key: ["/data"], fn });
      expect(second.meta.cached).toBe(true);
      expect(second.data).toStrictEqual(payload);
    });

    it("should override compression per call", async () => {
      const { cache, fn } = createCache();
      await cache.runAsync({ key: ["/native"], fn, compressionEnabled: false });
      expect(cache.getEntryInfo({ key: ["/native"] })?.format).toBe("native");

      const { cache: noCompression } = createCache({
        compressionEnabled: false,
      });
      await noCompression.runAsync({
        key: ["/compressed"],
        fn,
        compressionEnabled: true,
      });
      expect(noCompression.getEntryInfo({ key: ["/compressed"] })?.format).toBe(
        "compressed"
      );
    });

    it("should still read compressed entries when compression is disabled", async () => {
      const lru = new TimeLruCache({ maxSize: 50, defaultTTL: 10_000 });
      const { cache: writer, fn } = createCache({}, lru);
      const { cache: reader } = createCache({ compressionEnabled: false }, lru);
      await writer.runAsync({ key: ["/data"], fn });
      const { data, meta } = await reader.runAsync({ key: ["/data"], fn });
      expect(meta.cached).toBe(true);
      expect(meta.compression).toBeDefined();
      expect(data).toStrictEqual(payload);
      expect(fn).toHaveBeenCalledOnce();
    });

    it("should report compression disabled without compressor", () => {
      const cache = new XMemCache({
        lru: new TimeLruCache({ maxSize: 50, defaultTTL: 10_000 }),
      });
      expect(cache.compressionEnabled).toBe(false);
    });
  });

  describe("errors", () => {
    it("should not cache errors", async () => {
      const { cache, lru } = createCache();
      const failing = vi.fn<() => Promise<typeof payload>>(() =>
        Promise.reject(new Error("Upstream error"))
      );
      await expect(
        cache.runAsync({ key: ["/data"], fn: failing })
      ).rejects.toThrow("Upstream error");
      expect(lru.size).toBe(0);
      // the next call retries
      await expect(
        cache.runAsync({ key: ["/data"], fn: failing })
      ).rejects.toThrow("Upstream error");
      expect(failing).toHaveBeenCalledTimes(2);
    });

    it("should keep the existing entry when a revalidation fails", async () => {
      const { cache, fn } = createCache();
      await cache.runAsync({ key: ["/data"], fn });
      await expect(
        cache.runAsync({
          key: ["/data"],
          fn: () => Promise.reject(new Error("Upstream error")),
          forceRevalidate: true,
        })
      ).rejects.toThrow("Upstream error");
      const { data, meta } = await cache.runAsync({ key: ["/data"], fn });
      expect(meta.cached).toBe(true);
      expect(data).toStrictEqual(payload);
    });
  });
});
