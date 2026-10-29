import { type SupportedCacheValues, TimeLruCache } from "@httpx/lru";
import { expect, onTestFinished, vi } from "vitest";

import { CacheCompress } from "../compress/cache-compress";
import type { ICacheCompressor } from "../compress/types";
import { JsonSerializer } from "../serializer/json-serializer";
import { XMemCache } from "../x-mem-cache";

const bigPayload = {
  rows: Array.from({ length: 500 }, (_, i) => {
    return { id: i, name: `Item ${i}` };
  }),
};
const smallPayload = { id: 1 };

describe("XMemCache stats", () => {
  const createCache = () => {
    const lru = new TimeLruCache({ maxSize: 50, defaultTTL: 10_000 });
    const cache = new XMemCache({
      lru,
      compressor: new CacheCompress({
        algorithm: "gzip",
        serializer: new JsonSerializer(),
        minimumByteSaving: 1024,
        minimumStringLength: 0,
      }),
    });
    return { lru, cache };
  };

  it("should return empty stats", () => {
    const { cache } = createCache();
    expect(cache.getStats()).toStrictEqual({
      items: 0,
      nativeItems: 0,
      compressedItems: 0,
      compressedSize: 0,
      originalSize: 0,
      nativeOriginalSize: 0,
      compressionSavings: 0,
      entries: [],
      totals: {
        hits: 0,
        misses: 0,
        deduped: 0,
        bypassed: 0,
        savedTime: 0,
        peakSize: 0,
      },
    });
  });

  it("should return stats and entries info", async () => {
    const { cache } = createCache();
    const big1 = await cache.runAsync({
      key: ["/big", 1],
      fn: () => Promise.resolve(bigPayload),
    });
    const big2 = await cache.runAsync({
      key: ["/big", 2],
      fn: () => Promise.resolve(bigPayload),
    });
    const small = await cache.runAsync({
      key: ["/small"],
      fn: () => Promise.resolve(smallPayload),
    });

    const stats = cache.getStats();
    expect(stats.items).toBe(3);
    expect(stats.compressedItems).toBe(2);
    expect(stats.nativeItems).toBe(1);

    const meta1 = big1.meta.compression!;
    const meta2 = big2.meta.compression!;
    expect(stats.compressedSize).toBe(
      meta1.compressedSize + meta2.compressedSize
    );
    expect(stats.originalSize).toBe(meta1.originalSize + meta2.originalSize);
    expect(stats.originalSize).toBeGreaterThan(stats.compressedSize);
    expect(stats.nativeOriginalSize).toBe(JSON.stringify(smallPayload).length);
    expect(stats.compressionSavings).toBe(
      stats.originalSize - stats.compressedSize
    );
    expect(stats.totals.peakSize).toBe(
      stats.compressedSize + stats.nativeOriginalSize
    );

    expect(stats.entries).toStrictEqual([
      {
        key: big1.meta.generatedKey,
        namespace: "default",
        format: "compressed",
        size: meta1.compressedSize,
        originalSize: meta1.originalSize,
        compression: meta1,
        createdAt: expect.any(Number),
        timings: {
          fn: expect.any(Number),
          serialize: expect.any(Number),
          compress: expect.any(Number),
        },
        usage: {
          hits: 0,
          deduped: 0,
          avgReadTime: 0,
          savedTime: expect.any(Number),
        },
        expiresIn: expect.any(Number),
      },
      {
        key: big2.meta.generatedKey,
        namespace: "default",
        format: "compressed",
        size: meta2.compressedSize,
        originalSize: meta2.originalSize,
        compression: meta2,
        createdAt: expect.any(Number),
        timings: {
          fn: expect.any(Number),
          serialize: expect.any(Number),
          compress: expect.any(Number),
        },
        usage: {
          hits: 0,
          deduped: 0,
          avgReadTime: 0,
          savedTime: expect.any(Number),
        },
        expiresIn: expect.any(Number),
      },
      {
        key: small.meta.generatedKey,
        namespace: "default",
        format: "native",
        originalSize: JSON.stringify(smallPayload).length,
        skippedReason: "minimum_byte_saving_not_met",
        createdAt: expect.any(Number),
        timings: { fn: expect.any(Number), serialize: expect.any(Number) },
        usage: {
          hits: 0,
          deduped: 0,
          avgReadTime: 0,
          savedTime: expect.any(Number),
        },
        expiresIn: expect.any(Number),
      },
    ]);
  });

  it("should not change the lru order", async () => {
    const { cache, lru } = createCache();
    await cache.runAsync({
      key: ["/a"],
      fn: () => Promise.resolve(smallPayload),
    });
    await cache.runAsync({
      key: ["/b"],
      fn: () => Promise.resolve(smallPayload),
    });
    const before = [...lru].map(([k]) => k);
    cache.getStats();
    cache.getEntryInfo({ key: ["/a"] });
    expect([...lru].map(([k]) => k)).toStrictEqual(before);
  });

  it("should ignore expired entries and non XMemCache values", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(0);
    onTestFinished(() => {
      vi.useRealTimers();
    });
    const { cache, lru } = createCache();
    await cache.runAsync({
      key: ["/expired"],
      fn: () => Promise.resolve(smallPayload),
      ttl: 1,
    });
    await cache.runAsync({
      key: ["/alive"],
      fn: () => Promise.resolve(smallPayload),
    });
    lru.set("not-xmem", "raw value");
    vi.setSystemTime(5);
    const stats = cache.getStats();
    expect(stats.items).toBe(1);
    expect(stats.entries.map((e) => e.key)).toStrictEqual([
      '{"compressorId":"cache-compress:json","key":["/alive"],"ns":"default"}',
    ]);
    expect(cache.getEntryInfo({ key: ["/expired"] })).toBeUndefined();
  });

  it("should ignore values from other users of a shared lru", async () => {
    const { cache, lru } = createCache();
    const { meta } = await cache.runAsync({
      key: ["/xcache"],
      fn: () => Promise.resolve(smallPayload),
    });
    // values looking like xcache entries, but not created by XMemCache
    const lookalike = { format: "native", data: { id: "not-xcache" } };
    lru.set("other-lib", lookalike);
    lru.set("other-lib-raw", { id: 1 });
    const stats = cache.getStats();
    expect(stats.items).toBe(1);
    expect(stats.entries.map((e) => e.key)).toStrictEqual([meta.generatedKey]);

    // a foreign value stored under an xcache key is a cache miss
    const otherKey = cache.getEntryInfo({ key: ["/xcache"] })?.key;
    expect(otherKey).toBe(meta.generatedKey);
    lru.set(meta.generatedKey, lookalike);
    expect(cache.getEntryInfo({ key: ["/xcache"] })).toBeUndefined();
    const { data, meta: rerunMeta } = await cache.runAsync({
      key: ["/xcache"],
      fn: () => Promise.resolve(smallPayload),
    });
    expect(rerunMeta.cached).toBe(false);
    expect(data).toStrictEqual(smallPayload);
  });

  it("should return entry info", async () => {
    const { cache } = createCache();
    const { meta } = await cache.runAsync({
      key: ["/big"],
      fn: () => Promise.resolve(bigPayload),
    });
    expect(cache.getEntryInfo({ key: ["/big"] })).toStrictEqual({
      key: meta.generatedKey,
      namespace: "default",
      format: "compressed",
      size: meta.compression?.compressedSize,
      originalSize: meta.compression?.originalSize,
      compression: meta.compression,
      createdAt: expect.any(Number),
      timings: {
        fn: expect.any(Number),
        serialize: expect.any(Number),
        compress: expect.any(Number),
      },
      usage: {
        hits: 0,
        deduped: 0,
        avgReadTime: 0,
        savedTime: expect.any(Number),
      },
      expiresIn: expect.any(Number),
    });
    expect(
      cache.getEntryInfo({ key: ["/big"], namespace: "other" })
    ).toBeUndefined();
    expect(cache.getEntryInfo({ key: ["/unknown"] })).toBeUndefined();
  });

  it("should return the remaining ttl of entries", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(0);
    try {
      const { cache } = createCache();
      await cache.runAsync({
        key: ["/ttl"],
        fn: () => Promise.resolve(smallPayload),
        ttl: 5000,
      });
      await cache.runAsync({
        key: ["/default-ttl"],
        fn: () => Promise.resolve(smallPayload),
      });
      vi.setSystemTime(1000);
      expect(cache.getEntryInfo({ key: ["/ttl"] })?.expiresIn).toBe(4000);
      expect(cache.getStats().entries.map((e) => e.expiresIn)).toStrictEqual([
        4000, 9000,
      ]);
    } finally {
      vi.useRealTimers();
    }
  });

  it("should return the timings of the entry creation", async () => {
    vi.useFakeTimers({ toFake: ["performance"] });
    onTestFinished(() => {
      vi.useRealTimers();
    });
    const serializer = new JsonSerializer();
    const { serialize } = serializer;
    serializer.serialize = (data) => {
      vi.advanceTimersByTime(5);
      return serialize(data);
    };
    const cache = new XMemCache({
      lru: new TimeLruCache({ maxSize: 50, defaultTTL: 10_000 }),
      compressor: new CacheCompress({
        algorithm: "gzip",
        serializer,
        minimumByteSaving: 1024,
        minimumStringLength: 0,
      }),
    });
    const miss = await cache.runAsync({
      key: ["/slow"],
      fn: () => {
        vi.advanceTimersByTime(120);
        return Promise.resolve(bigPayload);
      },
    });
    expect(miss.meta.compression).toBeDefined();
    expect(miss.meta.timings).toStrictEqual({
      fn: 120,
      serialize: 5,
      compress: expect.any(Number),
    });
    // serialized, but too small to be compressed
    await cache.runAsync({
      key: ["/small"],
      fn: () => Promise.resolve(smallPayload),
    });
    // strings are not serialized
    await cache.runAsync({
      key: ["/string"],
      fn: () => Promise.resolve("a".repeat(5000)),
    });
    // cache hits return the timings of the execution that created the entry
    const hit = await cache.runAsync({
      key: ["/slow"],
      fn: () => Promise.resolve(bigPayload),
    });
    expect(hit.meta).toMatchObject({
      cached: true,
      timings: miss.meta.timings,
    });
    expect(cache.getEntryInfo({ key: ["/slow"] })?.timings).toStrictEqual(
      miss.meta.timings
    );
    expect(cache.getStats().entries.map((e) => e.timings)).toStrictEqual([
      { fn: 0, serialize: 5 },
      { fn: 0, compress: expect.any(Number) },
      miss.meta.timings,
    ]);
  });

  it("should return the read timings on compressed cache hits", async () => {
    vi.useFakeTimers({ toFake: ["performance"] });
    onTestFinished(() => {
      vi.useRealTimers();
    });
    const serializer = new JsonSerializer();
    const { deserialize } = serializer;
    serializer.deserialize = (data) => {
      vi.advanceTimersByTime(3);
      return deserialize(data);
    };
    const cache = new XMemCache({
      lru: new TimeLruCache({ maxSize: 50, defaultTTL: 10_000 }),
      compressor: new CacheCompress({
        algorithm: "gzip",
        serializer,
        minimumByteSaving: 1024,
        minimumStringLength: 0,
      }),
    });
    const run = (key: string, data: SupportedCacheValues) =>
      cache.runAsync({ key: [key], fn: () => Promise.resolve(data) });

    const miss = await run("/big", bigPayload);
    expect(miss.meta.readTimings).toBeUndefined();
    const hit = await run("/big", bigPayload);
    expect(hit.meta.cached).toBe(true);
    expect(hit.data).toStrictEqual(bigPayload);
    expect(hit.meta.readTimings).toStrictEqual({
      decompress: expect.any(Number),
      deserialize: 3,
    });
    // creation timings are unchanged
    expect(hit.meta.timings).toStrictEqual(miss.meta.timings);

    // strings are not deserialized
    await run("/string", "a".repeat(5000));
    const stringHit = await run("/string", "a".repeat(5000));
    expect(stringHit.meta.compression?.content).toBe("string");
    expect(stringHit.meta.readTimings).toStrictEqual({
      decompress: expect.any(Number),
    });

    // nothing to read for native entries
    await run("/small", smallPayload);
    const nativeHit = await run("/small", smallPayload);
    expect(nativeHit.meta.cached).toBe(true);
    expect(nativeHit.meta.readTimings).toBeUndefined();
  });

  it("should round the timings reported by custom compressors", async () => {
    const compressor: ICacheCompressor = {
      getIdentifier: () => "custom",
      compress: (data) =>
        Promise.resolve({
          status: "skipped",
          meta: { reason: "minimum_byte_saving_not_met" },
          data,
          timings: { serialize: 1.23456, compress: 0.004 },
        }),
      decompress: (result) => Promise.resolve(result.data as never),
    };
    const cache = new XMemCache({
      lru: new TimeLruCache({ maxSize: 50, defaultTTL: 10_000 }),
      compressor,
    });
    const { meta } = await cache.runAsync({
      key: ["/custom"],
      fn: () => Promise.resolve(smallPayload),
    });
    expect(meta.timings).toStrictEqual({
      fn: expect.any(Number),
      serialize: 1.23,
      compress: 0,
    });
    expect(String(meta.timings?.fn)).toMatch(/^\d+(\.\d{1,2})?$/);
  });

  it("should round the read timings reported by custom compressors", async () => {
    const compressor: ICacheCompressor = {
      getIdentifier: () => "custom",
      compress: () =>
        Promise.resolve({
          status: "success",
          meta: {
            algorithm: "gzip",
            encoding: "base64",
            serializer: "custom",
            originalSize: 10,
            compressedSize: 5,
            ratio: 2,
          },
          data: "compressed",
        }),
      decompress: (_result, timings) => {
        if (timings !== undefined) {
          timings.decompress = 1.23456;
          timings.deserialize = 0.004;
        }
        return Promise.resolve(smallPayload as never);
      },
    };
    const cache = new XMemCache({
      lru: new TimeLruCache({ maxSize: 50, defaultTTL: 10_000 }),
      compressor,
    });
    const run = () =>
      cache.runAsync({
        key: ["/custom"],
        fn: () => Promise.resolve(smallPayload),
      });
    await run();
    const { meta } = await run();
    expect(meta.readTimings).toStrictEqual({
      decompress: 1.23,
      deserialize: 0,
    });
  });

  it("should only return the function timing without compressor", async () => {
    const cache = new XMemCache({
      lru: new TimeLruCache({ maxSize: 50, defaultTTL: 10_000 }),
    });
    const { meta } = await cache.runAsync({
      key: ["/native"],
      fn: () => Promise.resolve(bigPayload),
    });
    expect(meta.timings).toStrictEqual({ fn: expect.any(Number) });
  });

  it("should return native entries without compressor", async () => {
    const lru = new TimeLruCache({ maxSize: 50, defaultTTL: 10_000 });
    const cache = new XMemCache({ lru });
    const { meta } = await cache.runAsync({
      key: ["/native"],
      fn: () => Promise.resolve(bigPayload),
    });
    expect(cache.getEntryInfo({ key: ["/native"] })).toStrictEqual({
      key: meta.generatedKey,
      namespace: "default",
      format: "native",
      createdAt: expect.any(Number),
      timings: { fn: expect.any(Number) },
      usage: {
        hits: 0,
        deduped: 0,
        avgReadTime: 0,
        savedTime: expect.any(Number),
      },
      expiresIn: expect.any(Number),
    });
    expect(cache.getStats()).toMatchObject({
      items: 1,
      nativeItems: 1,
    });
  });

  describe("original size of native entries", () => {
    it("should be computed for strings and bytes without compressor", async () => {
      const cache = new XMemCache({
        lru: new TimeLruCache({ maxSize: 50, defaultTTL: 10_000 }),
      });
      await cache.runAsync({
        key: ["/string"],
        fn: () => Promise.resolve("hello"),
      });
      await cache.runAsync({
        key: ["/bytes"],
        fn: () => Promise.resolve(new Uint8Array(12)),
      });
      // live objects can't be measured
      await cache.runAsync({
        key: ["/object"],
        fn: () => Promise.resolve(smallPayload),
      });
      expect(cache.getEntryInfo({ key: ["/string"] })?.originalSize).toBe(5);
      expect(cache.getEntryInfo({ key: ["/bytes"] })?.originalSize).toBe(12);
      expect(cache.getEntryInfo({ key: ["/object"] })).not.toHaveProperty(
        "originalSize"
      );
      expect(cache.getStats()).toMatchObject({
        nativeItems: 3,
        nativeOriginalSize: 17,
        originalSize: 0,
      });
    });

    it("should be computed when compression is disabled", async () => {
      const cache = new XMemCache({
        lru: new TimeLruCache({ maxSize: 50, defaultTTL: 10_000 }),
        compressionEnabled: false,
        compressor: new CacheCompress({
          algorithm: "gzip",
          serializer: new JsonSerializer(),
        }),
      });
      await cache.runAsync({
        key: ["/string"],
        fn: () => Promise.resolve("hello"),
      });
      expect(cache.getEntryInfo({ key: ["/string"] })).toMatchObject({
        format: "native",
        originalSize: 5,
        skippedReason: "compression_disabled",
      });
    });

    it("should be the serialized length when compression is skipped", async () => {
      const { cache } = createCache();
      await cache.runAsync({
        key: ["/small"],
        fn: () => Promise.resolve(smallPayload),
      });
      // not serialized
      await cache.runAsync({
        key: ["/trivial"],
        fn: () => Promise.resolve(42),
      });
      expect(cache.getEntryInfo({ key: ["/small"] })).toMatchObject({
        format: "native",
        originalSize: JSON.stringify(smallPayload).length,
        skippedReason: "minimum_byte_saving_not_met",
      });
      expect(cache.getEntryInfo({ key: ["/trivial"] })).toStrictEqual(
        expect.not.objectContaining({ originalSize: expect.anything() })
      );
      expect(cache.getStats().nativeOriginalSize).toBe(
        JSON.stringify(smallPayload).length
      );
    });
  });

  describe("peak size", () => {
    it("should keep the highest size encountered", async () => {
      const { cache } = createCache();
      await cache.runAsync({
        key: ["/big"],
        fn: () => Promise.resolve(bigPayload),
      });
      const { compressedSize } = cache.getStats();
      expect(compressedSize).toBeGreaterThan(0);
      cache.clear();
      expect(cache.getStats()).toMatchObject({
        compressedSize: 0,
        totals: { peakSize: compressedSize },
      });
      cache.resetStats();
      expect(cache.getStats().totals.peakSize).toBe(0);
    });

    it("should be sampled before clear and clearExpired", async () => {
      vi.useFakeTimers({ toFake: ["performance", "Date"] });
      onTestFinished(() => {
        vi.useRealTimers();
      });
      const { cache } = createCache();
      await cache.runAsync({
        key: ["/text"],
        fn: () => Promise.resolve("hello"),
      });
      cache.clear();
      expect(cache.getStats().totals.peakSize).toBe(5);

      await cache.runAsync({
        key: ["/expiring"],
        fn: () => Promise.resolve("hello world"),
        ttl: 1000,
      });
      await cache.runAsync({
        key: ["/kept"],
        fn: () => Promise.resolve("hello world!"),
      });
      vi.advanceTimersByTime(2000);
      // the expired entry is not counted
      expect(cache.clearExpired()).toBe(1);
      expect(cache.getStats().totals.peakSize).toBe(12);
    });
  });
});
