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

/**
 * Fake timers: the function takes 100ms, serialization 5ms and
 * deserialization 3ms (compression is not faked: 0ms).
 */
const setup = (options: { compressor: boolean }) => {
  vi.useFakeTimers({ toFake: ["performance", "Date"] });
  onTestFinished(() => {
    vi.useRealTimers();
  });
  const serializer = new JsonSerializer();
  const { serialize, deserialize } = serializer;
  serializer.serialize = (data) => {
    vi.advanceTimersByTime(5);
    return serialize(data);
  };
  serializer.deserialize = (data) => {
    vi.advanceTimersByTime(3);
    return deserialize(data);
  };
  const lru = new TimeLruCache({ maxSize: 50, defaultTTL: 10_000 });
  const cache = new XMemCache({
    lru,
    ...(options.compressor
      ? {
          compressor: new CacheCompress({
            algorithm: "gzip",
            serializer,
            minimumByteSaving: 1024,
            minimumStringLength: 0,
          }),
        }
      : {}),
  });
  const fn = vi.fn<() => Promise<typeof bigPayload>>(() => {
    vi.advanceTimersByTime(100);
    return Promise.resolve(bigPayload);
  });
  return { cache, lru, fn };
};

describe("XMemCache usage", () => {
  it("should track the hits and saved time of compressed entries", async () => {
    const { cache, fn } = setup({ compressor: true });
    const run = () => cache.runAsync({ key: ["/big"], fn });

    const miss = await run();
    expect(miss.meta.timings).toStrictEqual({
      fn: 100,
      serialize: 5,
      compress: 0,
    });
    // serialization is a cost until the entry is hit
    expect(cache.getEntryInfo({ key: ["/big"] })?.usage).toStrictEqual({
      hits: 0,
      deduped: 0,
      avgReadTime: 0,
      savedTime: -5,
    });

    await run();
    await run();
    expect(fn).toHaveBeenCalledOnce();
    // 2 hits * 100ms - 2 reads * 3ms - 5ms serialization
    expect(cache.getEntryInfo({ key: ["/big"] })?.usage).toStrictEqual({
      hits: 2,
      deduped: 0,
      avgReadTime: 3,
      savedTime: 189,
    });
    expect(cache.getStats().totals).toStrictEqual({
      hits: 2,
      misses: 1,
      deduped: 0,
      bypassed: 0,
      savedTime: 189,
    });
  });

  it("should track the hits of native entries without read time", async () => {
    const { cache, fn } = setup({ compressor: false });
    for (let i = 0; i < 4; i++) {
      await cache.runAsync({ key: ["/native"], fn });
    }
    expect(cache.getStats().entries[0]?.usage).toStrictEqual({
      hits: 3,
      deduped: 0,
      avgReadTime: 0,
      savedTime: 300,
    });
    expect(cache.getStats().totals).toMatchObject({
      hits: 3,
      misses: 1,
      savedTime: 300,
    });
  });

  it("should track the deduped calls", async () => {
    const { cache, fn } = setup({ compressor: false });
    await Promise.all(
      Array.from({ length: 3 }, () => cache.runAsync({ key: ["/dedupe"], fn }))
    );
    expect(fn).toHaveBeenCalledOnce();
    expect(cache.getEntryInfo({ key: ["/dedupe"] })?.usage).toStrictEqual({
      hits: 0,
      deduped: 2,
      avgReadTime: 0,
      savedTime: 200,
    });
    expect(cache.getStats().totals).toStrictEqual({
      hits: 0,
      misses: 1,
      deduped: 2,
      bypassed: 0,
      savedTime: 200,
    });
  });

  it("should track the hits of runAsyncEntry", async () => {
    const { cache, fn } = setup({ compressor: true });
    await cache.runAsyncEntry({ key: ["/entry"], fn });
    const { entry, cached } = await cache.runAsyncEntry({
      key: ["/entry"],
      fn,
    });
    expect(cached).toBe(true);
    expect(entry.usage).toStrictEqual({ hits: 1, deduped: 0, readTime: 0 });
    expect(cache.getStats().totals).toMatchObject({
      hits: 1,
      misses: 1,
      savedTime: 95,
    });
  });

  it("should count the bypassed calls without saved time", async () => {
    const { cache, fn } = setup({ compressor: true });
    await cache.runAsync({ key: ["/bypass"], fn, enabled: false });
    expect(cache.getStats().totals).toStrictEqual({
      hits: 0,
      misses: 0,
      deduped: 0,
      bypassed: 1,
      savedTime: 0,
    });
  });

  it("should reset the usage of replaced entries and keep the totals", async () => {
    const { cache, fn } = setup({ compressor: false });
    const run = () => cache.runAsync({ key: ["/ttl"], fn, ttl: 1000 });
    await run();
    await run();
    expect(cache.getEntryInfo({ key: ["/ttl"] })?.usage?.hits).toBe(1);

    // expired: the next call creates a new entry
    vi.advanceTimersByTime(2000);
    expect(cache.getEntryInfo({ key: ["/ttl"] })).toBeUndefined();
    await run();
    expect(cache.getEntryInfo({ key: ["/ttl"] })?.usage?.hits).toBe(0);
    expect(cache.getStats().totals).toMatchObject({
      hits: 1,
      misses: 2,
      savedTime: 100,
    });

    // replaced by a forced revalidation
    await run();
    await cache.runAsync({ key: ["/ttl"], fn, forceRevalidate: true });
    expect(cache.getEntryInfo({ key: ["/ttl"] })?.usage?.hits).toBe(0);
    expect(cache.getStats().totals).toMatchObject({ hits: 2, misses: 3 });
  });

  it("should keep the totals on clear and reset them with resetStats", async () => {
    const { cache, fn } = setup({ compressor: false });
    await cache.runAsync({ key: ["/a"], fn });
    await cache.runAsync({ key: ["/a"], fn });
    cache.clear();
    expect(cache.getStats()).toMatchObject({
      items: 0,
      totals: { hits: 1, misses: 1, savedTime: 100 },
    });
    cache.resetStats();
    expect(cache.getStats().totals).toStrictEqual({
      hits: 0,
      misses: 0,
      deduped: 0,
      bypassed: 0,
      savedTime: 0,
    });
  });

  it("should handle entries without usage (older versions, shared lru)", async () => {
    const { cache, lru, fn } = setup({ compressor: false });
    const { meta } = await cache.runAsync({
      key: ["/old"],
      fn: () => Promise.resolve(smallPayload),
    });
    const entry = lru.peek(meta.generatedKey) as Record<string, unknown>;
    delete entry.usage;
    delete entry.timings;
    const hit = await cache.runAsync({ key: ["/old"], fn });
    expect(hit.meta.cached).toBe(true);
    expect(cache.getEntryInfo({ key: ["/old"] })?.usage).toBeUndefined();
    expect(cache.getStats().totals).toMatchObject({ hits: 1, misses: 1 });
  });
});
