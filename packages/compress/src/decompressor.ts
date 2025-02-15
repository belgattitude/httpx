import { base64ToUint8Array } from 'uint8array-extras';

import type { SupportedCompressionAlgorithm } from './compression-algorithm';

export class Decompressor {
  #algorithm: SupportedCompressionAlgorithm;

  constructor(algorithm: SupportedCompressionAlgorithm) {
    this.#algorithm = algorithm;
  }
  /*
  toReadableStream = <T extends string | Uint8Array>(
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
    return readableStream.pipeThrough(new CompressionStream(this.#encoding));
  };

  toResponse = <T extends string | Uint8Array>(data: T): Response => {
    return new Response(this.toReadableStream(data));
  };

  fromUint8Array = async <T extends string | Uint8Array>(
    data: Uint8Array
  ): Promise<Uint8Array> => {
    return new Uint8Array(await this.toResponse(data).arrayBuffer());
  };
*/
  fromEncodedString = async (data: string): Promise<string> => {
    const inputReadableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(base64ToUint8Array(data));
        controller.close();
      },
    });

    const decompressedStream = inputReadableStream.pipeThrough(
      new DecompressionStream(this.#algorithm)
    );

    // Convert the decompressed stream to a string
    const decompressedArrayBuffer = await new Response(
      decompressedStream
    ).arrayBuffer();
    const decoder = new TextDecoder();
    return decoder.decode(decompressedArrayBuffer);
  };
}
