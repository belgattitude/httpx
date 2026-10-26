import { TimeLruCache } from "@httpx/lru";
import { expect, onTestFinished, vi } from "vitest";

import { CacheCompress } from "../compress/cache-compress";
import type { ICacheCompressor } from "../compress/types";
import { CborxSerializer } from "../serializer/cborx-serializer";
import { JsonSerializer } from "../serializer/json-serializer";
import { SuperjsonSerializer } from "../serializer/superjson-serializer";
import { XMemCache } from "../x-mem-cache";

describe("XMemCache config", () => {
  it("should return the config without compressor", () => {
    const cache = new XMemCache({
      lru: new TimeLruCache({ maxSize: 50, defaultTTL: 10_000 }),
    });
    expect(cache.getConfig()).toStrictEqual({
      namespace: "default",
      ttl: 10_000,
      maxSize: 50,
      enabled: true,
      compressionEnabled: false,
      dedupe: true,
    });
  });

  it("should return the config with options and compressor", () => {
    const cache = new XMemCache({
      lru: new TimeLruCache({ maxSize: 10, defaultTTL: 5000 }),
      namespace: "shop",
      enabled: false,
      dedupe: false,
      compressor: new CacheCompress({
        algorithm: "deflate",
        serializer: new SuperjsonSerializer(),
        encoding: "base64",
      }),
    });
    expect(cache.getConfig()).toStrictEqual({
      namespace: "shop",
      ttl: 5000,
      maxSize: 10,
      enabled: false,
      compressionEnabled: true,
      dedupe: false,
      compressor: {
        id: "cache-compress:superjson",
        algorithm: "deflate",
        encoding: "base64",
        serializer: "superjson",
        binarySerializer: false,
        jsonDetection: true,
        minimumRatio: 1.3,
        minimumStringLength: 16_384,
        minimumByteSaving: 32_768,
      },
    });
  });

  it("should report binary serializers and disabled compression", () => {
    const cache = new XMemCache({
      lru: new TimeLruCache({ maxSize: 10, defaultTTL: 5000 }),
      compressionEnabled: false,
      compressor: new CacheCompress({
        algorithm: "gzip",
        serializer: new CborxSerializer(),
      }),
    });
    expect(cache.getConfig()).toMatchObject({
      compressionEnabled: false,
      compressor: {
        id: "cache-compress:cbor-x",
        encoding: "binary",
        serializer: "cbor-x",
        binarySerializer: true,
        jsonDetection: false,
      },
    });
  });

  it("should return the identifier of custom compressors without config", () => {
    const compressor: ICacheCompressor = {
      compress: (data) =>
        Promise.resolve({ status: "failure", meta: {}, data }),
      decompress: <T>() => Promise.resolve(undefined as T),
      getIdentifier: () => "custom",
    };
    const cache = new XMemCache({
      lru: new TimeLruCache({ maxSize: 10, defaultTTL: 5000 }),
      compressor,
    });
    expect(cache.getConfig().compressor).toStrictEqual({ id: "custom" });
  });
});

describe("XMemCache clearExpired", () => {
  it("should remove expired entries only", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(0);
    onTestFinished(() => {
      vi.useRealTimers();
    });
    const lru = new TimeLruCache({ maxSize: 50, defaultTTL: 10_000 });
    const cache = new XMemCache({
      lru,
      compressor: new CacheCompress({
        algorithm: "gzip",
        serializer: new JsonSerializer(),
      }),
    });
    const fn = () => Promise.resolve({ id: 1 });
    await cache.runAsync({ key: ["/expired", 1], fn, ttl: 1 });
    await cache.runAsync({ key: ["/expired", 2], fn, ttl: 1 });
    await cache.runAsync({ key: ["/alive"], fn });
    // values not created by XMemCache are kept, even expired
    lru.set("not-xmem", "raw value", 1);
    vi.setSystemTime(5);

    expect(cache.clearExpired()).toBe(2);
    expect(lru.size).toBe(2);
    expect([...lru].map(([key]) => key)).toStrictEqual([
      '{"compressorId":"cache-compress:json","key":["/alive"],"ns":"default"}',
      "not-xmem",
    ]);
    expect(cache.getStats().items).toBe(1);
    expect(cache.clearExpired()).toBe(0);
  });

  it("should return 0 on an empty cache", () => {
    const cache = new XMemCache({
      lru: new TimeLruCache({ maxSize: 10, defaultTTL: 5000 }),
    });
    expect(cache.clearExpired()).toBe(0);
  });
});
