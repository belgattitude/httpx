import { TimeLruCache } from "@httpx/lru";
import { expect, onTestFinished, vi } from "vitest";

import { CacheCompress } from "../compress/cache-compress";
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
      entries: [],
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

    expect(stats.entries).toStrictEqual([
      {
        key: big1.meta.generatedKey,
        format: "compressed",
        size: meta1.compressedSize,
        compression: meta1,
        createdAt: expect.any(Number),
        expiresIn: expect.any(Number),
      },
      {
        key: big2.meta.generatedKey,
        format: "compressed",
        size: meta2.compressedSize,
        compression: meta2,
        createdAt: expect.any(Number),
        expiresIn: expect.any(Number),
      },
      {
        key: small.meta.generatedKey,
        format: "native",
        skippedReason: "minimum_byte_saving_not_met",
        createdAt: expect.any(Number),
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
      format: "compressed",
      size: meta.compression?.compressedSize,
      compression: meta.compression,
      createdAt: expect.any(Number),
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

  it("should return native entries without compressor", async () => {
    const lru = new TimeLruCache({ maxSize: 50, defaultTTL: 10_000 });
    const cache = new XMemCache({ lru });
    const { meta } = await cache.runAsync({
      key: ["/native"],
      fn: () => Promise.resolve(bigPayload),
    });
    expect(cache.getEntryInfo({ key: ["/native"] })).toStrictEqual({
      key: meta.generatedKey,
      format: "native",
      createdAt: expect.any(Number),
      expiresIn: expect.any(Number),
    });
    expect(cache.getStats()).toMatchObject({
      items: 1,
      nativeItems: 1,
    });
  });
});
