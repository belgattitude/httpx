export type CacheCompressSuccessMeta = {
  originalSize: number;
  compressedSize: number;
  ratio: number;
};

export type CacheCompressSkippedReason =
  | 'trivial_value'
  | 'uncompressible_value'
  | 'minimum_ratio_not_met'
  | 'minimum_byte_saving_not_met'
  | 'minimum_string_length_not_met';

export type CacheCompressResult<T = unknown> =
  | {
      status: 'success';
      data: string;
      meta: CacheCompressSuccessMeta;
    }
  | {
      status: 'failure';
      meta: {
        reason?: string;
      };
      data: T;
    }
  | {
      status: 'skipped';
      meta: {
        reason: CacheCompressSkippedReason;
      };
      data: T;
    };

export interface ICacheCompressor {
  compress: <T>(data: T) => Promise<CacheCompressResult>;
  decompress: <T = unknown>(data: CacheCompressResult) => Promise<T>;
  getIdentifier: () => string;
}
