import { TimeLruCache } from "@httpx/lru";
import { Encoder } from "cbor-x";

import { CacheCompress } from "../compress/cache-compress";
import { XMemCache } from "../x-mem-cache";
import { CborxSerializer } from "./cborx-serializer";

const extendedData = {
  date: new Date("2026-01-01T00:00:00.000Z"),
  bigint: 12_345_678_901_234_567_890n,
  testUndefined: undefined,
  notNumber: Number.NaN,
  map: new Map<unknown, unknown>([
    ["a", 1],
    [2, "b"],
  ]),
  set: new Set([1, 2]),
  bytes: new Uint8Array([1, 2, 3]),
  nested: { list: [1, null, "x"] },
};

describe("CborxSerializer", () => {
  it("should be a binary serializer", () => {
    const serializer = new CborxSerializer();
    expect(serializer.binary).toBe(true);
    expect(serializer.getIdentifier()).toBe("cbor-x");
    expect(String(serializer)).toBe("cbor-x");
    expect(serializer.serialize({ a: 1 })).toBeInstanceOf(Uint8Array);
  });

  it("should round-trip extended types", () => {
    const serializer = new CborxSerializer();
    expect(
      serializer.deserialize(serializer.serialize(extendedData))
    ).toStrictEqual(extendedData);
  });

  it("should use record extensions by default (smaller output)", () => {
    const rows = Array.from({ length: 100 }, (_, i) => {
      return { id: i, name: `Item ${i}` };
    });
    const withRecords = new CborxSerializer().serialize(rows);
    const withoutRecords = new CborxSerializer({ useRecords: false }).serialize(
      rows
    );
    expect(withRecords.length).toBeLessThan(withoutRecords.length);
    // records are readable by any cbor-x decoder
    expect(new Encoder().decode(withRecords)).toStrictEqual(rows);
  });

  it("should preserve shared and cyclic references by default", () => {
    const shared = { id: 1 };
    const data: Record<string, unknown> = { a: shared, b: shared };
    data.self = data;
    const serializer = new CborxSerializer();
    const result = serializer.deserialize<typeof data>(
      serializer.serialize(data)
    );
    expect(result.a).toStrictEqual(shared);
    expect(result.a).toBe(result.b);
    expect(result.self).toBe(result);
  });

  it("should duplicate shared references without structuredClone", () => {
    const shared = { id: 1 };
    const data = { a: shared, b: shared };
    const serializer = new CborxSerializer({ structuredClone: false });
    const result = serializer.deserialize<typeof data>(
      serializer.serialize(data)
    );
    expect(result).toStrictEqual(data);
    expect(result.a).not.toBe(result.b);
  });

  describe("with CacheCompress", () => {
    const createCompressor = () =>
      new CacheCompress({
        algorithm: "gzip",
        serializer: new CborxSerializer(),
        minimumByteSaving: 0,
        minimumStringLength: 0,
      });

    it("should not support json detection", () => {
      expect(createCompressor().supportsJsonDetection()).toBe(false);
    });

    it("should compress the serialized bytes", async () => {
      const compressor = createCompressor();
      const data = {
        ...extendedData,
        rows: Array.from({ length: 1000 }, (_, i) => {
          return { id: i, name: `Item ${i}`, date: new Date(i) };
        }),
      };
      const result = await compressor.compress(data);
      expect(result.status).toBe("success");
      expect(result.meta).toMatchObject({ serializer: "cbor-x" });
      expect(result.meta).not.toHaveProperty("content");
      const timings = {};
      await expect(
        compressor.decompress(result, timings)
      ).resolves.toStrictEqual(data);
      expect(timings).toStrictEqual({
        decompress: expect.any(Number),
        deserialize: expect.any(Number),
      });
    });

    it("should compress strings as-is", async () => {
      const compressor = createCompressor();
      const str = "<li>Hello 🦆</li>".repeat(1000);
      const result = await compressor.compress(str);
      expect(result.meta).toMatchObject({
        serializer: "cbor-x",
        content: "string",
      });
      await expect(compressor.decompress(result)).resolves.toBe(str);
    });
  });

  it("should work with XMemCache", async () => {
    const cache = new XMemCache({
      lru: new TimeLruCache({ maxSize: 10, defaultTTL: 60_000 }),
      compressor: new CacheCompress({
        algorithm: "gzip",
        serializer: new CborxSerializer(),
        encoding: "base64",
        minimumByteSaving: 0,
        minimumStringLength: 0,
      }),
    });
    const data = {
      rows: Array.from({ length: 500 }, (_, i) => {
        return { id: i, date: new Date(i), big: BigInt(i) };
      }),
    };
    const fn = vi.fn<() => Promise<typeof data>>(() => Promise.resolve(data));
    await cache.runAsync({ key: ["/cbor"], fn });
    const hit = await cache.runAsync({ key: ["/cbor"], fn });
    expect(fn).toHaveBeenCalledOnce();
    expect(hit.meta.cached).toBe(true);
    expect(hit.meta.compression).toMatchObject({
      serializer: "cbor-x",
      encoding: "base64",
    });
    expect(hit.data).toStrictEqual(data);
  });
});
