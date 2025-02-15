import { base64ToUint8Array } from 'uint8array-extras';

import type { SupportedCompressionAlgorithm } from './compression-algorithm';

export class Decompressor {
  #algorithm: SupportedCompressionAlgorithm;

  constructor(algorithm: SupportedCompressionAlgorithm) {
    this.#algorithm = algorithm;
  }

  /**
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
   *
   * @throws Error
   */
  fromEncodedString = async (data: string): Promise<string> => {
    return new TextDecoder().decode(
      await this.fromUint8Array(base64ToUint8Array(data))
    );
  };
}
