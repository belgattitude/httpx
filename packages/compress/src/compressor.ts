import { uint8ArrayToBase64 } from 'uint8array-extras';

import type { SupportedCompressionAlgorithm } from './compression-algorithm';
import type { SupportedStringEncodings } from './string-encodings';

export class Compressor {
  #algorithm: SupportedCompressionAlgorithm;

  constructor(compressionMethod: SupportedCompressionAlgorithm) {
    this.#algorithm = compressionMethod;
  }

  #toReadableStream = <T extends string | Uint8Array>(
    data: T
  ): ReadableStream<Uint8Array<ArrayBufferLike>> => {
    const readableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          typeof data === 'string' ? new TextEncoder().encode(data) : data
        );
        controller.close();
      },
    });
    return readableStream.pipeThrough(new CompressionStream(this.#algorithm));
  };

  toResponse = <T extends string | Uint8Array>(data: T): Response => {
    return new Response(this.#toReadableStream(data));
  };

  toUint8Array = async <T extends string | Uint8Array>(
    data: T
  ): Promise<Uint8Array> => {
    return new Uint8Array(await this.toResponse(data).arrayBuffer());
  };

  toEncodedString = async <T extends string | Uint8Array>(
    data: T,
    encoding: SupportedStringEncodings = 'base64'
  ): Promise<string> => {
    if (encoding !== 'base64') {
      throw new TypeError(`Unsupported string encoding: ${encoding}`);
    }
    return uint8ArrayToBase64(await this.toUint8Array(data));
  };
}
