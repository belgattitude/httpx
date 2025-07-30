import { Compressor, Decompressor } from '@httpx/compress';

import type { ICacheSerializer } from '../serializer/types';
import { isCompressible } from './is-compressible';
import type { CacheCompressResult, ICacheCompressor } from './types';

export type CacheGzipOptions = {
  serializer: ICacheSerializer;
  minimumRatio?: number; // Minimum compression ratio to consider compression effective
};

export class CacheGzip implements ICacheCompressor {
  #gzip: Compressor;
  #gunzip: Decompressor;
  #serializer: ICacheSerializer;
  constructor(options: CacheGzipOptions) {
    const { serializer, minimumRatio = 1 } = options;
    this.#gzip = new Compressor('gzip');
    this.#gunzip = new Decompressor('gzip');
    this.#serializer = serializer;
  }
  getIdentifier = (): string => {
    return `cache-gzip:${this.#serializer.getIdentifier()}`;
  };

  compress = async <T>(data: T): Promise<CacheCompressResult> => {
    if (isCompressible(data)) {
      const serialized = this.#serializer.serialize(data);
      const compressed = await this.#gzip.toEncodedString(serialized);
      return {
        status: 'success',
        meta: {
          compressedSize: compressed.length,
          originalSize: serialized.length,
          ratio:
            Math.floor((serialized.length / compressed.length) * 100) / 100,
        },
        data: compressed,
      };
    }
    return {
      status: 'skipped',
      meta: {
        reason: 'Content to simple to compress or unsupported, skipping gzip',
      },
      data,
    };
  };

  decompress = async <T = unknown>(data: CacheCompressResult): Promise<T> => {
    if (data.status !== 'success') {
      return data.data as T;
    }
    const serialized = await this.#gunzip.fromEncodedString(data.data);
    return this.#serializer.deserialize<T>(serialized);
  };
}
