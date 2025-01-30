export const decompress = async (input: Uint8Array): Promise<string> => {
  // Create a ReadableStream from the input Uint8Array
  const inputReadableStream = new ReadableStream({
    start(controller) {
      controller.enqueue(input);
      controller.close();
    },
  });

  // Decompress the ReadableStream using the gzip algorithm
  const decompressedStream = inputReadableStream.pipeThrough(
    new DecompressionStream('gzip')
  );

  // Convert the decompressed stream to a string
  const decompressedArrayBuffer = await new Response(
    decompressedStream
  ).arrayBuffer();
  const decoder = new TextDecoder();
  return decoder.decode(decompressedArrayBuffer);
};
export const compress = async (inputString: string): Promise<Uint8Array> => {
  const encoder = new TextEncoder();
  // Create a ReadableStream from the input string
  const inputReadableStream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(inputString));
      controller.close();
    },
  });

  // Compress the ReadableStream using the gzip algorithm
  const compressedStream = inputReadableStream.pipeThrough(
    new CompressionStream('gzip')
  );

  return new Uint8Array(await new Response(compressedStream).arrayBuffer());
};
