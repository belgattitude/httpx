import { expect } from "vitest";

import { CacheCompress } from "../compress/cache-compress";
import type { ICacheCompressor } from "../compress/types";
import { JsonSerializer } from "../serializer/json-serializer";
import { XMemCache } from "../x-mem-cache";

const bigPayload = {
  rows: Array.from({ length: 500 }, (_, i) => {
    return { id: i, name: `Item ${i}` };
  }),
};

/**
 * Return the paths of the values that are not JSON serializable as-is
 * (undefined, functions, symbols, bigints, non-finite numbers, class
 * instances), or would change through JSON.stringify.
 */
const getNonJsonPaths = (value: unknown, path = "$"): string[] => {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return [];
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? [] : [`${path} (${value})`];
  }
  if (typeof value !== "object") {
    // undefined, functions, symbols, bigints
    return [`${path} (${typeof value})`];
  }
  if (Array.isArray(value)) {
    return value.flatMap((v, i) => getNonJsonPaths(v, `${path}[${i}]`));
  }
  const proto = Object.getPrototypeOf(value) as unknown;
  if (proto !== Object.prototype && proto !== null) {
    return [`${path} (class instance)`];
  }
  return Object.entries(value).flatMap(([k, v]) =>
    getNonJsonPaths(v, `${path}.${k}`)
  );
};

const expectJsonSerializable = (value: unknown) => {
  expect(getNonJsonPaths(value)).toStrictEqual([]);
  // oxlint-disable-next-line unicorn/prefer-structured-clone -- checks the json round trip
  expect(JSON.parse(JSON.stringify(value))).toStrictEqual(value);
};

const fillCache = async (cache: XMemCache) => {
  // compressed
  await cache.runAsync({
    key: ["/big"],
    fn: () => Promise.resolve(bigPayload),
  });
  // hit
  await cache.runAsync({
    key: ["/big"],
    fn: () => Promise.resolve(bigPayload),
  });
  // compression skipped (too small), with tags
  await cache.runAsync({
    key: ["/small"],
    fn: () => Promise.resolve({ id: 1 }),
    tags: ["small"],
  });
  // strings, trivial values and null results
  await cache.runAsync({
    key: ["/string"],
    fn: () => Promise.resolve("x".repeat(2000)),
  });
  await cache.runAsync({ key: ["/number"], fn: () => Promise.resolve(1) });
  await cache.runAsync({ key: ["/null"], fn: () => Promise.resolve(null) });
  // compression disabled for the call, empty namespace, custom origin
  await cache.runAsync({
    key: ["/no-compression"],
    fn: () => Promise.resolve(bigPayload),
    compressionEnabled: false,
  });
  await cache.runAsync({
    key: ["/no-ns"],
    fn: () => Promise.resolve(bigPayload),
    namespace: "",
  });
  await cache.runAsync({
    key: ["/origin"],
    fn: () => Promise.resolve(bigPayload),
    origin: "custom",
  });
  // bypassed and deduped calls
  await cache.runAsync({
    key: ["/bypass"],
    fn: () => Promise.resolve(1),
    enabled: false,
  });
  await Promise.all([
    cache.runAsync({ key: ["/dedupe"], fn: () => Promise.resolve(1) }),
    cache.runAsync({ key: ["/dedupe"], fn: () => Promise.resolve(1) }),
  ]);
  cache.invalidateTags("unknown");
};

describe("XMemCache json serializable results", () => {
  const caches = {
    "no compressor": () =>
      new XMemCache({ lru: { maxSize: 50, defaultTTL: 10_000 } }),
    "binary compressor": () =>
      new XMemCache({
        lru: { maxSize: 50, defaultTTL: 10_000 },
        compressor: new CacheCompress({
          algorithm: "gzip",
          serializer: new JsonSerializer(),
          minimumByteSaving: 1024,
        }),
      }),
    "base64 compressor": () =>
      new XMemCache({
        lru: { maxSize: 50, defaultTTL: 10_000 },
        compressor: new CacheCompress({
          algorithm: "gzip",
          encoding: "base64",
          serializer: new JsonSerializer(),
        }),
      }),
  };

  it.each(Object.entries(caches))(
    "should return json serializable stats, entry info and config (%s)",
    async (_name, createCache) => {
      const cache = createCache();
      expectJsonSerializable(cache.getStats());
      await fillCache(cache);
      const stats = cache.getStats();
      expect(stats.items).toBeGreaterThan(5);
      expectJsonSerializable(stats);
      for (const key of ["/big", "/small", "/null"]) {
        expectJsonSerializable(cache.getEntryInfo({ key: [key] }));
      }
      expectJsonSerializable(cache.getConfig());
      expectJsonSerializable(cache.getTags());
    }
  );

  it("should omit undefined values reported by custom compressors", async () => {
    // ie: a compressor written in javascript (types forbid undefined values)
    const compressor = {
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
            content: undefined,
          },
          data: "compressed",
          timings: { serialize: undefined, compress: 1 },
        }),
      decompress: () => Promise.resolve("data" as never),
      getConfig: () => {
        return {
          algorithm: "gzip",
          encoding: "base64",
          serializer: "custom",
          minimumRatio: undefined,
        };
      },
    } as unknown as ICacheCompressor;
    const cache = new XMemCache({
      lru: { maxSize: 50, defaultTTL: 10_000 },
      compressor,
    });
    await cache.runAsync({ key: ["/a"], fn: () => Promise.resolve("data") });
    expectJsonSerializable(cache.getStats());
    expectJsonSerializable(cache.getEntryInfo({ key: ["/a"] }));
    expectJsonSerializable(cache.getConfig());
    expect(cache.getEntryInfo({ key: ["/a"] })?.compression).not.toHaveProperty(
      "content"
    );
    expect(cache.getConfig().compressor).not.toHaveProperty("minimumRatio");
  });
});
