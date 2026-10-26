import { Compressor, Decompressor } from "@httpx/compress";
import { Base64 } from "@httpx/encode";

import type {
  ICacheBinarySerializer,
  ICacheSerializer,
} from "../serializer/types";
import { elapsedSince, now } from "../timing";
import { isTrivialValue } from "./is-trivial-value";
import type {
  CacheCompressAlgorithm,
  CacheCompressContent,
  CacheCompressEncoding,
  CacheCompressResult,
  CacheCompressSkippedReason,
  CacheCompressSuccessMeta,
  CacheCompressorConfig,
  CacheCompressTimings,
  CacheDecompressTimings,
  ICacheCompressor,
} from "./types";

export type { CacheCompressEncoding } from "./types";

/**
 * CacheCompress constructor options.
 */
export type CacheCompressOptions = {
  /**
   * Serializer used to convert the data into a string (or bytes for binary
   * serializers) before compression (JsonSerializer, SuperjsonSerializer,
   * DevalueSerializer, CborxSerializer...).
   */
  serializer: ICacheSerializer | ICacheBinarySerializer;

  /**
   * Compression algorithm.
   */
  algorithm: CacheCompressAlgorithm;

  /**
   * Minimum achieved compression ratio to consider compression effective
   * If not reached, compression will be skipped.
   * @default 1.3
   */
  minimumRatio?: number;
  /**
   * Minimum length to activate compression, checked on string data before
   * serialization and on the serialized string (bytes for binary
   * serializers) before compression, so small payloads are never compressed.
   * @default 16384 (16K characters)
   */
  minimumStringLength?: number;

  /**
   * Skip compression if the achieved byte saving is less than this value.
   * @default 32768 (32 KB)
   */
  minimumByteSaving?: number;

  /**
   * How the compressed bytes are stored.
   * - "binary": raw Uint8Array, smallest memory footprint and no encoding cost.
   * - "base64" | "base64_urlsafe": string (~33% larger), when a string is required.
   * @default "binary"
   */
  encoding?: CacheCompressEncoding;

  /**
   * Store plain JSON data (without extended types) as JSON and read it with
   * JSON.parse (meta.content: "json"), when the serializer supports it
   * (SuperjsonSerializer, at no extra cost). Not supported by
   * DevalueSerializer, useless with JsonSerializer.
   * @default true
   */
  detectJson?: boolean;
};

const textDecoder = new TextDecoder();

const defaultOptions: Required<
  Pick<
    CacheCompressOptions,
    | "minimumRatio"
    | "minimumStringLength"
    | "minimumByteSaving"
    | "encoding"
    | "detectJson"
  >
> = {
  minimumRatio: 1.3,
  minimumStringLength: 16_384, // 16K characters
  minimumByteSaving: 32_768, // 32 KB
  encoding: "binary",
  detectJson: true,
} as const;

/**
 * Create a skipped result, with timings when something was measured.
 */
const skipped = <T>(
  data: T,
  reason: CacheCompressSkippedReason,
  timings: CacheCompressTimings,
  originalSize: number
): CacheCompressResult => {
  const result: CacheCompressResult = {
    status: "skipped",
    meta: { reason, originalSize },
    data,
  };
  if (timings.serialize !== undefined || timings.compress !== undefined) {
    result.timings = timings;
  }
  return result;
};

/**
 * Compressor for XMemCache: serialize the data, compress it (gzip or deflate)
 * and store it as Uint8Array (default) or base64 string.
 */
export class CacheCompress implements ICacheCompressor {
  readonly #gzip: Compressor;
  readonly #gunzip: Decompressor;
  readonly #serializer: ICacheSerializer | ICacheBinarySerializer;
  readonly #serializerId: string;
  readonly #algorithm: CacheCompressAlgorithm;
  readonly #options: {
    minimumRatio: number;
    minimumStringLength: number;
    minimumByteSaving: number;
    encoding: CacheCompressEncoding;
    detectJson: boolean;
  };

  /**
   * @example
   * ```typescript
   * import { CacheCompress } from '@httpx/xcache';
   * import { SuperjsonSerializer } from '@httpx/xcache/superjson';
   *
   * const customCacheCompressor = new CacheCompress({
   *   // Compression requires the data to be serialized (into a string)
   *   // JsonSerializer, SuperjsonSerializer, DevalueSerializer
   *   serializer: new SuperjsonSerializer(),
   *   algorithm: 'gzip', // or 'deflate'
   *   // Skip compression if the achieved compression ratio is less than
   *   // the provided ratio. 1.3 means that the compression will be skipped
   *   // if the ratio does not give at least 30 memory reduction
   *   // @default 1.3
   *   minimumRatio: 1.3,
   *   // Skip compression if the data (or its serialized form) is shorter
   *   // than 16K characters
   *   // @default 16_384
   *   minimumStringLength: 16_384,
   *   // Skip compression if the achieved byte saving is less than 32 KB
   *   // @default 32_768
   *   minimumByteSaving: 32_768,
   *   // Store compressed bytes as Uint8Array (or 'base64', 'base64_urlsafe')
   *   // @default 'binary'
   *   encoding: 'binary',
   * });
   * ```
   */
  constructor(options: CacheCompressOptions) {
    const { serializer, algorithm, ...restOptions } = {
      ...defaultOptions,
      ...options,
    };
    this.#gzip = new Compressor(algorithm);
    this.#gunzip = new Decompressor(algorithm);
    this.#serializer = serializer;
    this.#serializerId = serializer.getIdentifier();
    this.#algorithm = algorithm;
    this.#options = restOptions;
  }
  /**
   * Identifier of the compressor, ie: "cache-compress:superjson".
   */
  getIdentifier = (): string => `cache-compress:${this.#serializerId}`;

  /**
   * Whether previously compressed data (from its meta) can be decompressed
   * with the current options: same algorithm, encoding and serializer.
   */
  isCompatible = (meta: CacheCompressSuccessMeta): boolean =>
    meta.algorithm === this.#algorithm &&
    meta.encoding === this.#options.encoding &&
    meta.serializer === this.#serializerId;

  /**
   * Whether plain JSON data is detected and stored as JSON (detectJson
   * option and serializer supporting it, ie: SuperjsonSerializer).
   */
  supportsJsonDetection = (): boolean =>
    this.#options.detectJson &&
    this.#serializer.binary !== true &&
    this.#serializer.serializeWithJsonDetection !== undefined;

  /**
   * Configuration of the compressor (algorithm, encoding, serializer and
   * thresholds).
   */
  getConfig = (): CacheCompressorConfig => {
    const { encoding, minimumRatio, minimumStringLength, minimumByteSaving } =
      this.#options;
    return {
      algorithm: this.#algorithm,
      encoding,
      serializer: this.#serializerId,
      binarySerializer: this.#serializer.binary === true,
      jsonDetection: this.supportsJsonDetection(),
      minimumRatio,
      minimumStringLength,
      minimumByteSaving,
    };
  };

  /**
   * Serialize and compress the data. Strings are compressed as-is, without
   * serializer (meta.content: "string"), plain JSON is stored as JSON when
   * detected (meta.content: "json", see detectJson). Compression is skipped (data
   * returned as-is) for trivial values (ie: numbers), when the data or its serialized form is
   * shorter than minimumStringLength (or minimumByteSaving, as the saving
   * can't exceed it), or when the minimum ratio or byte saving are not met.
   * The time spent serializing and compressing is returned in timings.
   */
  compress = async <T>(data: T): Promise<CacheCompressResult> => {
    const { minimumRatio, minimumStringLength, minimumByteSaving } =
      this.#options;
    if (!isTrivialValue(data)) {
      return {
        status: "skipped",
        meta: {
          reason: "trivial_value",
        },
        data,
      };
    }

    const { encoding } = this.#options;
    const timings: CacheCompressTimings = {};
    let content: CacheCompressContent | undefined;
    let serialized: string | Uint8Array;
    // strings don't need to be serialized
    if (typeof data === "string") {
      content = "string";
      serialized = data;
    } else {
      const start = now();
      const serializer = this.#serializer;
      const detected =
        this.#options.detectJson && serializer.binary !== true
          ? serializer.serializeWithJsonDetection?.(data)
          : undefined;
      if (detected === undefined) {
        serialized = serializer.serialize(data);
      } else {
        ({ serialized } = detected);
        if (detected.json) {
          content = "json";
        }
      }
      timings.serialize = elapsedSince(start);
    }
    // Don't even try to compress small payloads
    if (serialized.length < minimumStringLength) {
      return skipped(
        data,
        "minimum_string_length_not_met",
        timings,
        serialized.length
      );
    }
    // The byte saving can't exceed the serialized length
    if (serialized.length < minimumByteSaving) {
      return skipped(
        data,
        "minimum_byte_saving_not_met",
        timings,
        serialized.length
      );
    }
    // Compress the serialized string first, then optionally encode the bytes
    const start = now();
    const compressed =
      encoding === "binary"
        ? await this.#gzip.toUint8Array(serialized)
        : await this.#gzip.toEncodedString(serialized, { encoding });
    timings.compress = elapsedSince(start);
    if (
      Math.max(serialized.length - compressed.length, 0) < minimumByteSaving
    ) {
      return skipped(
        data,
        "minimum_byte_saving_not_met",
        timings,
        serialized.length
      );
    }
    const ratio =
      compressed.length > 0
        ? Math.floor((serialized.length / compressed.length) * 100) / 100
        : 0;

    if (ratio < minimumRatio) {
      return skipped(data, "minimum_ratio_not_met", timings, serialized.length);
    }

    const meta: CacheCompressSuccessMeta = {
      algorithm: this.#algorithm,
      encoding,
      serializer: this.#serializerId,
      compressedSize: compressed.length,
      originalSize: serialized.length,
      ratio,
    };
    if (content !== undefined) {
      meta.content = content;
    }
    return { status: "success", meta, data: compressed, timings };
  };

  /**
   * Decompress and deserialize the data. Skipped or failed results are
   * returned as-is. When provided, timings is filled with the time spent
   * decompressing and deserializing (strings are not deserialized, plain
   * JSON is parsed with JSON.parse).
   *
   * @throws TypeError if the data was compressed with incompatible options
   * (algorithm, encoding or serializer).
   */
  decompress = async <T = unknown>(
    data: CacheCompressResult,
    timings?: CacheDecompressTimings
  ): Promise<T> => {
    if (data.status !== "success") {
      return data.data as T;
    }
    if (!this.isCompatible(data.meta)) {
      throw new TypeError(
        `Incompatible compressed data (${data.meta.algorithm}/${data.meta.encoding}/${data.meta.serializer}), expected ${this.#algorithm}/${this.#options.encoding}/${this.#serializerId}`
      );
    }
    let start = now();
    const bytes = await this.#gunzip.fromUint8Array(
      typeof data.data === "string" ? Base64.toUint8Array(data.data) : data.data
    );
    const { content } = data.meta;
    const serializer = this.#serializer;
    // binary serializers read the bytes, others the decoded string
    const text =
      serializer.binary === true && content === undefined
        ? ""
        : textDecoder.decode(bytes);
    if (timings !== undefined) {
      timings.decompress = elapsedSince(start);
    }
    if (content === "string") {
      return text as T;
    }
    start = now();
    let deserialized: T;
    if (content === "json") {
      deserialized = JSON.parse(text) as T;
    } else if (serializer.binary === true) {
      deserialized = serializer.deserialize<T>(bytes);
    } else {
      deserialized = serializer.deserialize<T>(text);
    }
    if (timings !== undefined) {
      timings.deserialize = elapsedSince(start);
    }
    return deserialized;
  };
}
