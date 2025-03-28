import { uint8ArrayToBase64 } from 'uint8array-extras';

import type { SupportedCompressionAlgorithm } from './compression-algorithm';
import { globalCache } from './global-cache';
import {
  type EncodeStringOptions,
  supportedStringEncodings,
} from './string-encodings';

export class Compressor {
  #algorithm: SupportedCompressionAlgorithm;

  /**
   * Create a new Compressor instance.
   *
   * ```typescript
   * import { Compressor } from '@httpx/compress';
   *
   * const compressor = new Compressor('gzip'); // or 'deflate'
   *
   * const binary = await compressor.toUint8Array('Hello, World! 🦆');
   * const textEncoded = await compressor.toEncodedString('Hello, World! 🦆');
   * ```
   */
  constructor(compressionMethod: SupportedCompressionAlgorithm) {
    this.#algorithm = compressionMethod;
  }

  /**
   * Compress the given data and return it as a Uint8Array binary format
   *
   * ```typescript
   * import { Compressor } from '@httpx/compress';
   *
   * const compressor = new Compressor('gzip');
   * const longString = 'Hello, World! 🦆'.repeat(500_000);
   * const compressedBinary = await compressor.Uint8Array(longString);
   * ```
   * @throws Error
   */
  toUint8Array = async <T extends string | Uint8Array>(
    data: T
  ): Promise<Uint8Array> => {
    const readableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          typeof data === 'string'
            ? globalCache.utf8TextEncoder.encode(data)
            : data
        );
        controller.close();
      },
    });
    const compressedStream = readableStream.pipeThrough(
      new CompressionStream(this.#algorithm)
    );

    return new Uint8Array(await new Response(compressedStream).arrayBuffer());
  };

  /**
   * Compress the given data and return it as a base64 encoded string.
   *
   * ```typescript
   * import { Compressor } from '@httpx/compress';
   *
   * const compressor = new Compressor('gzip');
   * const longString = 'Hello, World! 🦆'.repeat(500_000);
   *
   * const compressedString = await compressor.toEncodedString(longString, {
   *   // Default is 'base64'
   *   encoding: 'base64',
   * });
   * ```
   *
   * @throws TypeError if the encoding is not supported
   */
  toEncodedString = async <T extends string | Uint8Array>(
    data: T,
    options?: EncodeStringOptions
  ): Promise<string> => {
    const { encoding = 'base64' } = options ?? {};
    if (!supportedStringEncodings.includes(encoding)) {
      throw new TypeError(`Unsupported string encoding: ${encoding}`);
    }
    return uint8ArrayToBase64(await this.toUint8Array(data), {
      urlSafe: encoding === 'base64_urlsafe',
    });
  };
}
