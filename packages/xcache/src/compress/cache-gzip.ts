import { Compressor, Decompressor } from '@httpx/compress';

import type { ICacheSerializer } from '../serializer/types';
import { isTrivialValue } from './is-trivial-value';
import type { CacheCompressResult, ICacheCompressor } from './types';

export type CacheGzipOptions = {
  serializer: ICacheSerializer;
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
};

const defaultOptions: Required<
  Pick<
    CacheGzipOptions,
    'minimumRatio' | 'minimumStringLength' | 'minimumByteSaving'
  >
> = {
  minimumRatio: 1.3,
  minimumStringLength: 1000,
  minimumByteSaving: 16_384, // 16 KB
} as const;

export class CacheGzip implements ICacheCompressor {
  #gzip: Compressor;
  #gunzip: Decompressor;
  #serializer: ICacheSerializer;
  #options: {
    minimumRatio: number;
    minimumStringLength: number;
    minimumByteSaving: number;
  };

  /**
   * @example
   * ```typescript
   * const cacheGzip = new CacheGzip({
   *   serializer: new DevalueSerializer(),
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
  constructor(options: CacheGzipOptions) {
    const { serializer, ...restOptions } = {
      ...defaultOptions,
      ...options,
    };
    this.#gzip = new Compressor('gzip');
    this.#gunzip = new Decompressor('gzip');
    this.#serializer = serializer;
    this.#options = restOptions;
  }
  getIdentifier = (): string => {
    return `cache-gzip:${this.#serializer.getIdentifier()}`;
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
    const compressed = await this.#gzip.toEncodedString(serialized);
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
    const serialized = await this.#gunzip.fromEncodedString(data.data);
    return this.#serializer.deserialize<T>(serialized);
  };
}
