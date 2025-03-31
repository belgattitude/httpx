// eslint-disable-next-line import-x/no-extraneous-dependencies
import { base64ToUint8Array } from 'uint8array-extras';

import type { SupportedCompressionAlgorithm } from './compression-algorithm';
import { globalCache } from './global-cache';
import {
  type EncodeStringOptions,
  supportedStringEncodings,
} from './string-encodings';

export class Decompressor {
  #algorithm: SupportedCompressionAlgorithm;

  constructor(algorithm: SupportedCompressionAlgorithm) {
    this.#algorithm = algorithm;
  }

  /**
   * Decompress a compressed Uint8Array and return it as a Uint8Array
   *
   * ```typescript
   * import { Decompressor } from '@httpx/compress';
   * const decompressor = new Decompressor('gzip');
   * const decompressed = await decompressor.fromUint8Array(compressedData);
   * ```
   *
   * @throws Error
   */
  fromUint8Array = async (data: Uint8Array): Promise<Uint8Array> => {
    const inputReadableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(data);
        controller.close();
      },
    });

    const decompressedStream = inputReadableStream.pipeThrough(
      new DecompressionStream(this.#algorithm)
    );

    const buffer = await new Response(decompressedStream).arrayBuffer();
    return new Uint8Array(buffer);
  };

  /**
   * Decompress a compressed string and return it as a string
   *
   * ```typescript
   * import { Decompressor } from '@httpx/compress';
   *
   * const decompressor = new Decompressor('gzip');
   *
   * // Previously compressed with Compressor.toEncodedString()
   * const compressedString = 'H4sIAAAAAAAAAwvJLS5R4gUAFvQ7FwAAAA==';
   *
   * const decompressedString = await decompressor.fromEncodedString(compressedString);
   * ```
   *
   * @throws Error
   */
  fromEncodedString = async (
    compressedString: string,
    options?: EncodeStringOptions
  ): Promise<string> => {
    const { encoding = 'base64' } = options ?? {};
    if (!supportedStringEncodings.includes(encoding)) {
      throw new TypeError(`Unsupported string encoding: ${encoding}`);
    }
    return globalCache.utf8TextDecoder.decode(
      await this.fromUint8Array(base64ToUint8Array(compressedString))
    );
  };
}
