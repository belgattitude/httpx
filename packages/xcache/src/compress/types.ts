export type CacheCompressAlgorithm = "gzip" | "deflate";

export type CacheCompressEncoding = "binary" | "base64" | "base64_urlsafe";

export type CacheCompressSuccessMeta = {
  /** Compression algorithm used */
  algorithm: CacheCompressAlgorithm;
  /** How the compressed bytes are stored */
  encoding: CacheCompressEncoding;
  /** Identifier of the serializer used (ie: "json", "superjson", "devalue") */
  serializer: string;
  /** Length of the serialized string before compression */
  originalSize: number;
  /** Length of the compressed data (bytes for binary, chars for base64) */
  compressedSize: number;
  ratio: number;
};

export type CacheCompressSkippedReason =
  | "trivial_value"
  | "uncompressible_value"
  | "minimum_ratio_not_met"
  | "minimum_byte_saving_not_met"
  | "minimum_string_length_not_met";

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

export interface ICacheCompressor {
  compress: <T>(data: T) => Promise<CacheCompressResult>;
  decompress: <T = unknown>(data: CacheCompressResult) => Promise<T>;
  getIdentifier: () => string;
  /**
   * Whether a previously compressed entry can be decompressed with the
   * current options (algorithm, encoding, serializer). Incompatible entries
   * are considered as cache misses by XMemCache.
   */
  isCompatible?: (meta: CacheCompressSuccessMeta) => boolean;
}
