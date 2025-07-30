import { Compressor, Decompressor } from '@httpx/compress';

import type { ICacheSerializer } from '../serializer/types';
import type { ICacheCompressor } from './types';

export class CacheGzip implements ICacheCompressor {
  #gzip: Compressor;
  #gunzip: Decompressor;
  #serializer: ICacheSerializer;
  constructor(options: { serializer: ICacheSerializer }) {
    const { serializer } = options;
    this.#gzip = new Compressor('gzip');
    this.#gunzip = new Decompressor('gzip');
    this.#serializer = serializer;
  }
  compress = async <T>(data: T): Promise<string> => {
    const serialized = this.#serializer.serialize(data);
    return this.#gzip.toEncodedString(serialized);
  };
  decompress = async <T = unknown>(data: string): Promise<T> => {
    const serialized = await this.#gunzip.fromEncodedString(data);
    return this.#serializer.deserialize<T>(serialized);
  };
}
