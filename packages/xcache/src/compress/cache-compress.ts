import { Compressor, Decompressor } from "@httpx/compress";

import type { ICacheSerializer } from "../serializer/types";
import { isTrivialValue } from "./is-trivial-value";
import type {
  CacheCompressAlgorithm,
  CacheCompressEncoding,
  CacheCompressResult,
  CacheCompressSuccessMeta,
  ICacheCompressor,
} from "./types";

export type { CacheCompressEncoding } from "./types";

/**
 * CacheCompress constructor options.
 */
export type CacheCompressOptions = {
  /**
   * Serializer used to convert the data into a string before compression
   * (JsonSerializer, SuperjsonSerializer, DevalueSerializer...).
   */
  serializer: ICacheSerializer;

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
   * serialization and on the serialized string before compression, so
   * small payloads are never compressed.
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
};

const textDecoder = new TextDecoder();

/**
 * Serializer identifier stored in the meta of strings compressed as-is
 * (strings are never serialized).
 */
const noSerializerId = "none";

const defaultOptions: Required<
  Pick<
    CacheCompressOptions,
    "minimumRatio" | "minimumStringLength" | "minimumByteSaving" | "encoding"
  >
> = {
  minimumRatio: 1.3,
  minimumStringLength: 16_384, // 16K characters
  minimumByteSaving: 32_768, // 32 KB
  encoding: "binary",
} as const;

/**
 * Compressor for XMemCache: serialize the data, compress it (gzip or deflate)
 * and store it as Uint8Array (default) or base64 string.
 */
export class CacheCompress implements ICacheCompressor {
  readonly #gzip: Compressor;
  readonly #gunzip: Decompressor;
  readonly #serializer: ICacheSerializer;
  readonly #serializerId: string;
  readonly #algorithm: CacheCompressAlgorithm;
  readonly #options: {
    minimumRatio: number;
    minimumStringLength: number;
    minimumByteSaving: number;
    encoding: CacheCompressEncoding;
  };

  /**
   * @example
   * ```typescript
   * import { CacheCompress, SuperjsonSerializer } from '@httpx/xcache';
   *
   * const customCacheCompressor = new CacheCompress({
   *   // Compression requires the data to be serialized (into a string)
   *   // JsonSerializer, SuperjsonSerialier, DevalueSerializer
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
   * with the current options: same algorithm, encoding and serializer (or
   * no serializer for strings).
   */
  isCompatible = (meta: CacheCompressSuccessMeta): boolean =>
    meta.algorithm === this.#algorithm &&
    meta.encoding === this.#options.encoding &&
    (meta.serializer === this.#serializerId ||
      meta.serializer === noSerializerId);

  /**
   * Serialize and compress the data. Strings are compressed as-is, without
   * serializer (meta.serializer: "none"). Compression is skipped (data
   * returned as-is) for trivial values (ie: numbers), when the data or its serialized form is
   * shorter than minimumStringLength (or minimumByteSaving, as the saving
   * can't exceed it), or when the minimum ratio or byte saving are not met.
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
    const isString = typeof data === "string";
    // strings don't need to be serialized
    const serialized = isString ? data : this.#serializer.serialize(data);
    // Don't even try to compress small payloads
    if (serialized.length < minimumStringLength) {
      return {
        status: "skipped",
        meta: {
          reason: "minimum_string_length_not_met",
        },
        data,
      };
    }
    // The byte saving can't exceed the serialized length
    if (serialized.length < minimumByteSaving) {
      return {
        status: "skipped",
        meta: {
          reason: "minimum_byte_saving_not_met",
        },
        data,
      };
    }
    // Compress the serialized string first, then optionally encode the bytes
    const compressed =
      encoding === "binary"
        ? await this.#gzip.toUint8Array(serialized)
        : await this.#gzip.toEncodedString(serialized, { encoding });
    if (
      Math.max(serialized.length - compressed.length, 0) < minimumByteSaving
    ) {
      return {
        status: "skipped",
        meta: {
          reason: "minimum_byte_saving_not_met",
        },
        data,
      };
    }
    const ratio =
      compressed.length > 0
        ? Math.floor((serialized.length / compressed.length) * 100) / 100
        : 0;

    if (ratio < minimumRatio) {
      return {
        status: "skipped",
        meta: {
          reason: "minimum_ratio_not_met",
        },
        data,
      };
    }

    return {
      status: "success",
      meta: {
        algorithm: this.#algorithm,
        encoding,
        serializer: isString ? noSerializerId : this.#serializerId,
        compressedSize: compressed.length,
        originalSize: serialized.length,
        ratio,
      },
      data: compressed,
    };
  };

  /**
   * Decompress and deserialize the data. Skipped or failed results are
   * returned as-is.
   *
   * @throws TypeError if the data was compressed with incompatible options
   * (algorithm, encoding or serializer).
   */
  decompress = async <T = unknown>(data: CacheCompressResult): Promise<T> => {
    if (data.status !== "success") {
      return data.data as T;
    }
    if (!this.isCompatible(data.meta)) {
      throw new TypeError(
        `Incompatible compressed data (${data.meta.algorithm}/${data.meta.encoding}/${data.meta.serializer}), expected ${this.#algorithm}/${this.#options.encoding}/${this.#serializerId}`
      );
    }
    const serialized =
      typeof data.data === "string"
        ? await this.#gunzip.fromEncodedString(data.data, {
            encoding:
              this.#options.encoding === "base64_urlsafe"
                ? "base64_urlsafe"
                : "base64",
          })
        : textDecoder.decode(await this.#gunzip.fromUint8Array(data.data));
    return data.meta.serializer === noSerializerId
      ? (serialized as T)
      : this.#serializer.deserialize<T>(serialized);
  };
}
