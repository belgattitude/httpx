import { TimeLruCache } from "@httpx/lru";
import { expect, expectTypeOf } from "vitest";

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
    const lru = new TimeLruCache({
      maxSize: 50,
      defaultTTL: 10_000,
    });

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
      expect(lru.size).toBe(1);

      const { data: secondRunData } = await runCached();
      expect(secondRunData).toStrictEqual(payload);
      expect(lru.size).toBe(1);

      const removed = lru.clear();
      expect(removed).toBe(1); // One item should be removed from the cache
    });
  });
});
