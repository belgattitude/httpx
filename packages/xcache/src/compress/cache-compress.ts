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
   * If data is a string, minimum string length to activate compression.
   * @default: 1000
   */
  minimumStringLength?: number;

  /**
   * Skip compression if the achieved byte saving is less than this value.
   * @default 16384 (16 KB)
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

const defaultOptions: Required<
  Pick<
    CacheCompressOptions,
    "minimumRatio" | "minimumStringLength" | "minimumByteSaving" | "encoding"
  >
> = {
  minimumRatio: 1.3,
  minimumStringLength: 1000,
  minimumByteSaving: 16_384, // 16 KB
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
   *   // Skip compression if the result is a string shorter than 1000 characters
   *   // @default 1000
   *   minimumStringLength: 1000,
   *   // Skip compression if the achieved byte saving is less than 16 KB
   *   // @default 16_384
   *   minimumByteSaving: 16_384,
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
   * Serialize and compress the data. Compression is skipped (data returned
   * as-is) for trivial values or when the minimum length, ratio or byte
   * saving are not met.
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
    if (typeof data === "string" && data.length < minimumStringLength) {
      return {
        status: "skipped",
        meta: {
          reason: "minimum_string_length_not_met",
        },
        data,
      };
    }

    const { encoding } = this.#options;
    // Compress the serialized string first, then optionally encode the bytes
    const serialized = this.#serializer.serialize(data);
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
        serializer: this.#serializerId,
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
    return this.#serializer.deserialize<T>(serialized);
  };
}
