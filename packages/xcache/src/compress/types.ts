export type CacheCompressSuccessMeta = {
  originalSize: number;
  compressedSize: number;
  ratio: number;
};

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
        reason?: string;
      };
      data: T;
    };

export interface ICacheCompressor {
  compress: <T>(data: T) => Promise<CacheCompressResult>;
  decompress: <T = unknown>(data: CacheCompressResult) => Promise<T>;
  getIdentifier: () => string;
}
