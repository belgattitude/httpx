import { DevalueSerializer } from "../serializer/devalue-serializer";
import { JsonSerializer } from "../serializer/json-serializer";
import { SuperjsonSerializer } from "../serializer/superjson-serializer";
import type { ICacheSerializer } from "../serializer/types";
import { CacheCompress, type CacheCompressEncoding } from "./cache-compress";
import type {
  CacheCompressSkippedReason,
  CacheCompressSuccessMeta,
} from "./types";

const generateArrayOfRecords = (rows: number, extendedTypeSupport: boolean) => {
  return {
    success: true,
    rows: Array.from({ length: rows }, (_, i) => {
      return {
        id: 1000 + i,
        name: `Item ${1000 + i}`,
        description: `Long description ${1000 + i} 🦆`,
        testNull: null,
        ...(extendedTypeSupport
          ? {
              date: new Date(Date.now() - i * 1000),
              bigint: BigInt(1000 + i),
              testUndefined: undefined,
              notNumber: Number.NaN,
            }
          : {}),
      };
    }),
  };
};

describe.each([
  [new DevalueSerializer(), "gzip", true],
  [new JsonSerializer(), "gzip", false],
  [new SuperjsonSerializer(), "gzip", true],
  [new DevalueSerializer(), "deflate", true],
  [new JsonSerializer(), "deflate", false],
  [new SuperjsonSerializer(), "deflate", true],
] satisfies [
  serializer: ICacheSerializer,
  algo: "gzip" | "deflate",
  extendedTypeSupport: boolean,
][])(
  "CacheCompress tests with %s serializer",
  (serializer, algorithm, extendedTypeSupport) => {
    it.each([
      [undefined, "uint8array"],
      ["binary", "uint8array"],
      ["base64", "string"],
      ["base64_urlsafe", "string"],
    ] satisfies [CacheCompressEncoding | undefined, "uint8array" | "string"][])(
      `should compress and decompress data correctly (${extendedTypeSupport ? "extendedTypeSupport" : "nativeTypes"}) with "%s" encoding`,
      async (encoding, expectedDataType) => {
        const cacheGzip = new CacheCompress({
          algorithm,
          minimumRatio: 1,
          minimumByteSaving: 4096,
          minimumStringLength: 0,
          serializer,
          ...(encoding === undefined ? {} : { encoding }),
        });

        const generatedData = generateArrayOfRecords(1000, extendedTypeSupport);

        const result = await cacheGzip.compress(generatedData);
        const { meta, status } = result;
        expect(status).toBe("success");
        expect((meta as CacheCompressSuccessMeta).ratio).toBeGreaterThan(2);
        expect(
          result.data instanceof Uint8Array ? "uint8array" : typeof result.data
        ).toBe(expectedDataType);
        expect((meta as CacheCompressSuccessMeta).compressedSize).toBe(
          (result.data as string | Uint8Array).length
        );

        const decompressedData = await cacheGzip.decompress(result);
        expect(decompressedData).toStrictEqual(generatedData);
      }
    );

    it("should include algorithm, encoding and serializer in meta", async () => {
      const cacheCompress = new CacheCompress({
        algorithm,
        serializer,
        encoding: "base64",
        minimumRatio: 1,
        minimumByteSaving: 0,
        minimumStringLength: 0,
      });
      const result = await cacheCompress.compress(
        generateArrayOfRecords(100, extendedTypeSupport)
      );
      expect(result.status).toBe("success");
      expect(result.meta).toMatchObject({
        algorithm,
        encoding: "base64",
        serializer: serializer.getIdentifier(),
      });
      expect(
        cacheCompress.isCompatible(result.meta as CacheCompressSuccessMeta)
      ).toBe(true);
    });

    it("should refuse to decompress incompatible data", async () => {
      const writer = new CacheCompress({
        algorithm,
        serializer,
        encoding: "base64",
        minimumRatio: 1,
        minimumByteSaving: 0,
        minimumStringLength: 0,
      });
      const reader = new CacheCompress({
        algorithm,
        serializer,
        encoding: "binary",
      });
      const result = await writer.compress(
        generateArrayOfRecords(100, extendedTypeSupport)
      );
      expect(reader.isCompatible(result.meta as CacheCompressSuccessMeta)).toBe(
        false
      );
      await expect(reader.decompress(result)).rejects.toThrow(TypeError);
    });

    it("should skip compression for strings not meeting minimum length", async () => {
      const cacheGzip = new CacheCompress({
        algorithm,
        serializer,
        minimumStringLength: 3,
      });
      const result = await cacheGzip.compress("ab");
      expect(result.status).toBe("skipped");
      expect((result.meta as { reason?: string }).reason).toBe(
        "minimum_string_length_not_met"
      );
    });

    it("should not skip compression for strings meeting minimum length", async () => {
      const cacheGzip = new CacheCompress({
        algorithm,
        serializer,
        minimumStringLength: 1,
        minimumRatio: 0.01,
        minimumByteSaving: 0,
      });
      const result = await cacheGzip.compress("ab");
      expect(result.status).toBe("success");
    });

    describe("strings and numbers should never be serialized", () => {
      afterEach(() => {
        vi.restoreAllMocks();
      });

      it.each(["base64", "binary"] satisfies CacheCompressEncoding[])(
        'should compress strings as-is with "%s" encoding',
        async (encoding) => {
          const serializeSpy = vi.spyOn(serializer, "serialize");
          const deserializeSpy = vi.spyOn(serializer, "deserialize");
          const cacheGzip = new CacheCompress({
            serializer,
            algorithm,
            encoding,
            minimumStringLength: 0,
            minimumByteSaving: 0,
          });
          const str = '<p class="text">Hello 🦆</p>'.repeat(500);
          const result = await cacheGzip.compress(str);
          expect(result.status).toBe("success");
          expect(result.meta).toMatchObject({
            serializer: "none",
            originalSize: str.length,
          });
          expect(
            cacheGzip.isCompatible(result.meta as CacheCompressSuccessMeta)
          ).toBe(true);
          await expect(cacheGzip.decompress(result)).resolves.toBe(str);
          expect(serializeSpy).not.toHaveBeenCalled();
          expect(deserializeSpy).not.toHaveBeenCalled();
        }
      );

      it.each([
        ["short string", "abc"],
        ["integer", 10],
        ["float", 3.14],
        ["NaN", Number.NaN],
      ])("should not serialize %s values", async (_label, val) => {
        const serializeSpy = vi.spyOn(serializer, "serialize");
        const cacheGzip = new CacheCompress({ serializer, algorithm });
        const result = await cacheGzip.compress(val);
        expect(result.status).toBe("skipped");
        await expect(cacheGzip.decompress(result)).resolves.toBe(val);
        expect(serializeSpy).not.toHaveBeenCalled();
      });
    });

    it.each([
      ["boolean", true, "trivial_value"],
      ["number", 10, "trivial_value"],
      ["bigint", 10n, "trivial_value"],
      ["null", null, "trivial_value"],
      ["undefined", undefined, "trivial_value"],
      ["empty_array", [], "trivial_value"],
    ] satisfies [string, unknown, CacheCompressSkippedReason][])(
      'should not compress "%s" values',
      async (_label, val, reason) => {
        const cacheGzip = new CacheCompress({ serializer, algorithm });

        const result = await cacheGzip.compress(val);
        expect(result.status).toBe("skipped");
        expect(result.meta).toStrictEqual({
          reason,
        });

        const data = await cacheGzip.decompress(result);
        expect(data).toStrictEqual(val);
      }
    );

    it("should skip compression when minimum ratio is not met", async () => {
      const cacheGzip = new CacheCompress({
        serializer,
        algorithm,
        minimumRatio: 2,
        minimumStringLength: 1,
        minimumByteSaving: 0,
      });
      const result = await cacheGzip.compress("ab");
      expect(result.status).toBe("skipped");
      expect((result.meta as { reason?: string }).reason).toBe(
        "minimum_ratio_not_met"
      );
      const data = await cacheGzip.decompress(result);
      expect(data).toBe("ab");
    });

    it("should not skip compression when minimum ratio is met", async () => {
      const cacheGzip = new CacheCompress({
        serializer,
        algorithm,
        minimumRatio: 1.5,
        minimumStringLength: 1,
        minimumByteSaving: 128,
      });
      const result = await cacheGzip.compress("ab".repeat(256));
      expect(result.status).toBe("success");
    });

    describe("small payloads should never be compressed", () => {
      afterEach(() => {
        vi.restoreAllMocks();
      });

      it("should skip when the serialized data is shorter than minimumStringLength", async () => {
        const compressionSpy = vi.spyOn(globalThis, "CompressionStream");
        const cacheGzip = new CacheCompress({
          serializer,
          algorithm,
          minimumByteSaving: 0,
        });
        // ~13 KB serialized, below the 16K default
        const data = generateArrayOfRecords(150, false);
        expect(serializer.serialize(data).length).toBeLessThan(16_384);
        const result = await cacheGzip.compress(data);
        expect(result).toStrictEqual({
          status: "skipped",
          meta: { reason: "minimum_string_length_not_met" },
          data,
        });
        expect(compressionSpy).not.toHaveBeenCalled();
      });

      it("should skip when the serialized data is shorter than minimumByteSaving", async () => {
        const compressionSpy = vi.spyOn(globalThis, "CompressionStream");
        const cacheGzip = new CacheCompress({
          serializer,
          algorithm,
          minimumStringLength: 0,
          minimumByteSaving: 1_000_000,
        });
        const data = generateArrayOfRecords(150, false);
        const result = await cacheGzip.compress(data);
        expect(result.meta).toStrictEqual({
          reason: "minimum_byte_saving_not_met",
        });
        expect(compressionSpy).not.toHaveBeenCalled();
      });

      it("should compress when the serialized data is long enough", async () => {
        const compressionSpy = vi.spyOn(globalThis, "CompressionStream");
        const cacheGzip = new CacheCompress({ serializer, algorithm });
        const result = await cacheGzip.compress(
          generateArrayOfRecords(2000, false)
        );
        expect(result.status).toBe("success");
        expect(compressionSpy).toHaveBeenCalledOnce();
      });
    });

    it("should skip compression for strings shorter than 16K characters by default", async () => {
      const cacheGzip = new CacheCompress({ serializer, algorithm });
      const result = await cacheGzip.compress("a".repeat(16_383));
      expect(result.status).toBe("skipped");
      expect((result.meta as { reason?: string }).reason).toBe(
        "minimum_string_length_not_met"
      );
    });

    it("should skip compression when saving less than 32 KB by default", async () => {
      const cacheGzip = new CacheCompress({ serializer, algorithm });
      // highly compressible: the saving is close to the serialized length
      const below = await cacheGzip.compress("a".repeat(25_000));
      expect(below.status).toBe("skipped");
      expect((below.meta as { reason?: string }).reason).toBe(
        "minimum_byte_saving_not_met"
      );
      const above = await cacheGzip.compress("a".repeat(40_000));
      expect(above.status).toBe("success");
    });

    it("should skip compression when minimum byte saving is not met", async () => {
      const cacheGzip = new CacheCompress({
        serializer,
        algorithm,
        minimumRatio: 1.5,
        minimumStringLength: 1,
        minimumByteSaving: 256,
      });
      const result = await cacheGzip.compress("ab".repeat(128));
      expect(result.status).toBe("skipped");
      expect((result.meta as { reason?: string }).reason).toBe(
        "minimum_byte_saving_not_met"
      );
    });
  }
);
