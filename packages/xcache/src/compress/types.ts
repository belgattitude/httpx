/**
 * Supported compression algorithms.
 */
export type CacheCompressAlgorithm = "gzip" | "deflate";

/**
 * How the compressed bytes are stored.
 * - "binary": raw Uint8Array, smallest memory footprint and no encoding cost.
 * - "base64" | "base64_urlsafe": string (~33% larger).
 */
export type CacheCompressEncoding = "binary" | "base64" | "base64_urlsafe";

/**
 * Compressed content not created by the serializer (see
 * CacheCompressSuccessMeta.content).
 */
export type CacheCompressContent = "string" | "json";

/**
 * Meta of successfully compressed data, stored with the cache entry.
 */
export type CacheCompressSuccessMeta = {
  /** Compression algorithm used */
  algorithm: CacheCompressAlgorithm;
  /** How the compressed bytes are stored */
  encoding: CacheCompressEncoding;
  /** Identifier of the serializer (ie: "json", "superjson", "devalue", "cbor-x") */
  serializer: string;
  /**
   * How the compressed content was created, when not by the serializer:
   * - "string": a string compressed as-is (not serialized, not deserialized).
   * - "json": plain JSON detected by the serializer (detectJson option),
   *   deserialized with JSON.parse.
   */
  content?: CacheCompressContent;
  /** Length of the serialized string (bytes for binary serializers) before compression */
  originalSize: number;
  /** Length of the compressed data (bytes for binary, chars for base64) */
  compressedSize: number;
  /** originalSize / compressedSize */
  ratio: number;
};

/**
 * Time spent by the compressor (milliseconds).
 */
export type CacheCompressTimings = {
  /** Serialization time, absent when not serialized (ie: strings) */
  serialize?: number;
  /**
   * Compression time, absent when compression wasn't attempted. Present
   * when compression was skipped after compressing (ie: ratio not met).
   */
  compress?: number;
};

/**
 * Time spent by the compressor reading compressed data (milliseconds).
 */
export type CacheDecompressTimings = {
  /** Decompression time */
  decompress?: number;
  /** Deserialization time, absent when not deserialized (ie: strings) */
  deserialize?: number;
};

/**
 * Reasons why compression was skipped.
 */
export type CacheCompressSkippedReason =
  | "trivial_value"
  | "uncompressible_value"
  | "minimum_ratio_not_met"
  | "minimum_byte_saving_not_met"
  | "minimum_string_length_not_met";

/**
 * Result of ICacheCompressor.compress.
 * - "success": data is compressed.
 * - "skipped": data is returned as-is (ie: too small to be worth it).
 * - "failure": data is returned as-is.
 */
export type CacheCompressResult<T = unknown> = (
  | {
      status: "success";
      data: string | Uint8Array;
      meta: CacheCompressSuccessMeta;
    }
  | {
      status: "failure";
      meta: {
        reason?: string;
      };
      data: T;
    }
  | {
      status: "skipped";
      meta: {
        reason: CacheCompressSkippedReason;
        /**
         * Length of the serialized string (bytes for binary serializers),
         * when computed before compression was skipped (absent for trivial
         * values).
         */
        originalSize?: number;
      };
      data: T;
    }
) & {
  /** Time spent serializing and compressing, when measured */
  timings?: CacheCompressTimings;
};

/**
 * Configuration of a compressor, returned by ICacheCompressor.getConfig.
 */
export type CacheCompressorConfig = {
  /** Compression algorithm */
  algorithm: CacheCompressAlgorithm;
  /** How the compressed bytes are stored ("binary": Uint8Array) */
  encoding: CacheCompressEncoding;
  /** Identifier of the serializer (ie: "json", "superjson", "cbor-x") */
  serializer: string;
  /** Whether the serializer is binary (serializes into bytes) */
  binarySerializer: boolean;
  /** Whether plain JSON data is detected and stored as JSON */
  jsonDetection: boolean;
  /** Minimum compression ratio */
  minimumRatio: number;
  /** Minimum length to activate compression */
  minimumStringLength: number;
  /** Minimum byte saving */
  minimumByteSaving: number;
};

/**
 * Compressor interface used by XMemCache (ie: CacheCompress).
 */
export interface ICacheCompressor {
  /** Serialize and compress the data */
  compress: <T>(data: T) => Promise<CacheCompressResult>;
  /**
   * Decompress and deserialize the data. When provided, timings is filled
   * with the time spent (optional for custom compressors).
   */
  decompress: <T = unknown>(
    data: CacheCompressResult,
    timings?: CacheDecompressTimings
  ) => Promise<T>;
  /** Identifier of the compressor, used in the generated cache keys */
  getIdentifier: () => string;
  /**
   * Whether a previously compressed entry can be decompressed with the
   * current options (algorithm, encoding, serializer). Incompatible entries
   * are considered as cache misses by XMemCache.
   */
  isCompatible?: (meta: CacheCompressSuccessMeta) => boolean;
  /**
   * Whether plain JSON data is detected and stored as JSON (meta.content:
   * "json"), ie: CacheCompress with the detectJson option and a serializer
   * supporting it (SuperjsonSerializer).
   */
  supportsJsonDetection?: () => boolean;
  /**
   * Configuration of the compressor (algorithm, encoding, serializer...),
   * returned by XMemCache.getConfig.
   */
  getConfig?: () => CacheCompressorConfig;
}
