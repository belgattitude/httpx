import { Compressor, Decompressor } from '@httpx/compress';

import type { ICacheSerializer } from '../serializer/types';
import { isTrivialValue } from './is-trivial-value';
import type { CacheCompressResult, ICacheCompressor } from './types';

export type CacheCompressOptions = {
  serializer: ICacheSerializer;

  algorithm: 'gzip' | 'deflate';

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
  encoding?: 'base64' | 'base64_urlsafe';
};

const defaultOptions: Required<
  Pick<
    CacheCompressOptions,
    'minimumRatio' | 'minimumStringLength' | 'minimumByteSaving' | 'encoding'
  >
> = {
  minimumRatio: 1.3,
  minimumStringLength: 1000,
  minimumByteSaving: 16_384, // 16 KB
  encoding: 'base64',
} as const;

export class CacheCompress implements ICacheCompressor {
  #gzip: Compressor;
  #gunzip: Decompressor;
  #serializer: ICacheSerializer;
  #options: {
    minimumRatio: number;
    minimumStringLength: number;
    minimumByteSaving: number;
    encoding: 'base64' | 'base64_urlsafe';
  };

  /**
   * @example
   * ```typescript
   * const cacheGzip = new CacheGzip({
   *   serializer: new DevalueSerializer(),
   *   algorithm: 'deflate', // or 'gzip'
   *   // Skip compression if the achieved compression ratio is less than
   *   // the provided ratio. 1.3 means that the compression will be skipped
   *   // if the ratio does not give at least 30 memory reduction
   *   // @ default 1.3
   *   minimumRatio: 1.3,
   *   // Skip compression if the result is a string shorter than 1000 characters
   *   minimumStringLength: 1000,
   *   // Skip compression if the achieved byte saving is less than 16 KB
   *   minimumByteSaving: 16_384,
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
    this.#options = restOptions;
  }
  getIdentifier = (): string => {
    return `cache-compress:${this.#serializer.getIdentifier()}`;
  };

  compress = async <T>(data: T): Promise<CacheCompressResult> => {
    const { minimumRatio, minimumStringLength, minimumByteSaving } =
      this.#options;
    if (!isTrivialValue(data)) {
      return {
        status: 'skipped',
        meta: {
          reason: 'trivial_value',
        },
        data,
      };
    }
    if (typeof data === 'string' && data.length < minimumStringLength) {
      return {
        status: 'skipped',
        meta: {
          reason: 'minimum_string_length_not_met',
        },
        data,
      };
    }

    const serialized = this.#serializer.serialize(data);
    const compressed = await this.#gzip.toEncodedString(serialized, {
      encoding: this.#options.encoding,
    });
    if (
      Math.max(serialized.length - compressed.length, 0) < minimumByteSaving
    ) {
      return {
        status: 'skipped',
        meta: {
          reason: 'minimum_byte_saving_not_met',
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
        status: 'skipped',
        meta: {
          reason: 'minimum_ratio_not_met',
        },
        data,
      };
    }

    return {
      status: 'success',
      meta: {
        compressedSize: compressed.length,
        originalSize: serialized.length,
        ratio,
      },
      data: compressed,
    };
  };

  decompress = async <T = unknown>(data: CacheCompressResult): Promise<T> => {
    if (data.status !== 'success') {
      return data.data as T;
    }
    const serialized = await this.#gunzip.fromEncodedString(data.data, {
      encoding: this.#options.encoding,
    });
    return this.#serializer.deserialize<T>(serialized);
  };
}
