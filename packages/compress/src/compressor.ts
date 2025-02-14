import type { SupportedEncodings } from './types';

export class Compressor {
  #encoding: SupportedEncodings;

  constructor(encoding: SupportedEncodings) {
    this.#encoding = encoding;
  }

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

  toUint8Array = async <T extends string | Uint8Array>(
    data: T
  ): Promise<Uint8Array> => {
    return new Uint8Array(await this.toResponse(data).arrayBuffer());
  };

  toString = async <T extends string | Uint8Array>(
    data: T
  ): Promise<string> => {
    return new TextDecoder().decode(await this.toUint8Array(data));
  };
}
