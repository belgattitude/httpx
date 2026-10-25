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
 * Meta of successfully compressed data, stored with the cache entry.
 */
export type CacheCompressSuccessMeta = {
  /** Compression algorithm used */
  algorithm: CacheCompressAlgorithm;
  /** How the compressed bytes are stored */
  encoding: CacheCompressEncoding;
  /**
   * Identifier of the serializer used (ie: "json", "superjson", "devalue"),
   * "none" for strings (compressed as-is)
   */
  serializer: string;
  /** Length of the serialized string (or string) before compression */
  originalSize: number;
  /** Length of the compressed data (bytes for binary, chars for base64) */
  compressedSize: number;
  /** originalSize / compressedSize */
  ratio: number;
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
export type CacheCompressResult<T = unknown> =
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
      };
      data: T;
    };

/**
 * Compressor interface used by XMemCache (ie: CacheCompress).
 */
export interface ICacheCompressor {
  /** Serialize and compress the data */
  compress: <T>(data: T) => Promise<CacheCompressResult>;
  /** Decompress and deserialize the data */
  decompress: <T = unknown>(data: CacheCompressResult) => Promise<T>;
  /** Identifier of the compressor, used in the generated cache keys */
  getIdentifier: () => string;
  /**
   * Whether a previously compressed entry can be decompressed with the
   * current options (algorithm, encoding, serializer). Incompatible entries
   * are considered as cache misses by XMemCache.
   */
  isCompatible?: (meta: CacheCompressSuccessMeta) => boolean;
}
