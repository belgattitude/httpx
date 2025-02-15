import { uint8ArrayToBase64 } from 'uint8array-extras';

import type { SupportedCompressionAlgorithm } from './compression-algorithm';
import type { SupportedStringEncodings } from './string-encodings';

export class Compressor {
  #algorithm: SupportedCompressionAlgorithm;

  constructor(compressionMethod: SupportedCompressionAlgorithm) {
    this.#algorithm = compressionMethod;
  }

  /**
   *
   * @throws Error
   */
  toUint8Array = async <T extends string | Uint8Array>(
    data: T
  ): Promise<Uint8Array> => {
    const readableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          typeof data === 'string' ? new TextEncoder().encode(data) : data
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
   * @throws Error
   */
  toEncodedString = async <T extends string | Uint8Array>(
    data: T,
    options?: {
      encoding?: SupportedStringEncodings;
    }
  ): Promise<string> => {
    const { encoding = 'base64' } = options ?? {};
    if (encoding !== 'base64') {
      throw new TypeError(`Unsupported string encoding: ${encoding}`);
    }
    return uint8ArrayToBase64(await this.toUint8Array(data));
  };
}
