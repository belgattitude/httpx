import { expect, expectTypeOf, vi } from "vitest";

import { CacheCompress } from "../compress/cache-compress";
import { DevalueSerializer } from "../serializer/devalue-serializer";
import { XMemCache } from "../x-mem-cache";

describe.each([["gzip", "deflate"]])("XMemCache compression", () => {
  const payload = {
    message: `Hello world &à`.repeat(50),
    bigint: 1234567890123456789012345678901234567890n,
    date: new Date(),
    test: ["10", 1, true, null, undefined],
  };

  const fetchDataFn = () => Promise.resolve(payload);

  describe("XMemCache.runAsync", () => {
    const lru = {
      maxSize: 50,
      defaultTTL: 10_000,
    };

    const xMemCache = new XMemCache({
      lru,
      compressor: new CacheCompress({
        algorithm: "gzip",
        serializer: new DevalueSerializer(),
      }),
    });

    it("should execute the function and cache the result", async () => {
      const runCached = async () =>
        await xMemCache.runAsync({
          key: ["/api/compression-test"],
          fn: () => fetchDataFn(),
        });

      const { data: firstRunData, meta: firstRunMeta } = await runCached();
      expect(firstRunData).toStrictEqual(payload);
      expectTypeOf(firstRunData).toEqualTypeOf<typeof payload>();

      expect(firstRunMeta.cached).toBe(false);
      expect(firstRunMeta.generatedKey).toBe(
        '{"compressorId":"cache-compress:devalue","key":["/api/compression-test"],"ns":"default"}'
      );
      expect(xMemCache.size).toBe(1);

      const { data: secondRunData } = await runCached();
      expect(secondRunData).toStrictEqual(payload);
      expect(xMemCache.size).toBe(1);

      const removed = xMemCache.clear();
      expect(removed).toBe(1); // One item should be removed from the cache
    });

    it("should return the compression meta", async () => {
      const cache = new XMemCache({
        lru,
        compressor: new CacheCompress({
          algorithm: "gzip",
          serializer: new DevalueSerializer(),
          minimumByteSaving: 0,
          minimumStringLength: 0,
        }),
      });
      const runCached = async () =>
        await cache.runAsync({
          key: ["/api/compression-meta-test"],
          fn: () => fetchDataFn(),
        });
      const expectedMeta = {
        algorithm: "gzip",
        encoding: "binary",
        serializer: "devalue",
        originalSize: expect.any(Number),
        compressedSize: expect.any(Number),
        ratio: expect.any(Number),
      };
      const { meta: firstRunMeta } = await runCached();
      expect(firstRunMeta.cached).toBe(false);
      expect(firstRunMeta.compression).toStrictEqual(expectedMeta);
      expect(firstRunMeta.compression?.compressedSize).toBeLessThan(
        firstRunMeta.compression?.originalSize ?? 0
      );

      const { meta: secondRunMeta } = await runCached();
      expect(secondRunMeta.cached).toBe(true);
      expect(secondRunMeta.compression).toStrictEqual(firstRunMeta.compression);
      cache.clear();
    });
  });

  describe("XMemCache compression", () => {
    it("should compress strings without calling the serializer", async () => {
      const serializer = new DevalueSerializer();
      const serializeSpy = vi.spyOn(serializer, "serialize");
      const deserializeSpy = vi.spyOn(serializer, "deserialize");
      const cache = new XMemCache({
        lru: { maxSize: 50, defaultTTL: 10_000 },
        compressor: new CacheCompress({
          algorithm: "gzip",
          serializer,
          minimumStringLength: 0,
          minimumByteSaving: 0,
        }),
      });
      const html = "<li>Hello world &à</li>".repeat(1000);
      const run = () =>
        cache.runAsync({ key: ["/api/html"], fn: () => Promise.resolve(html) });
      const miss = await run();
      expect(miss.meta.compression).toMatchObject({
        serializer: "devalue",
        content: "string",
      });
      const hit = await run();
      expect(hit.meta.cached).toBe(true);
      expect(hit.data).toBe(html);
      expect(serializeSpy).not.toHaveBeenCalled();
      expect(deserializeSpy).not.toHaveBeenCalled();
    });
  });
});
