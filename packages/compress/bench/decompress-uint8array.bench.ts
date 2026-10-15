import prettyBytes from "pretty-bytes";
import { describe, test } from "vitest";

import { benchConfig } from "./bench-config";

const {
  deflateDecompressor,
  gzipDecompressor,
  gzipCompressor,
  deflateCompressor,
  benchOptions,
  longString,
} = benchConfig;

describe(`Decompressor`, () => {
  const size = prettyBytes(longString.length);

  test(`Decompressor.fromUint8Array`, async ({ bench }) => {
    const gzippedUint8Array = await gzipCompressor.toUint8Array(longString);

    const deflatedUint8Array = await deflateCompressor.toUint8Array(longString);

    await bench.compare(
      bench(`Decompressor('gzip').fromUint8Array (compressed size: ${prettyBytes(gzippedUint8Array.byteLength)} / total: ${size})`, async () => {
        await gzipDecompressor.fromUint8Array(gzippedUint8Array);
      }),
      bench(`Decompressor('deflate').fromUint8Array (compressed size: ${prettyBytes(deflatedUint8Array.byteLength)} / total: ${size})`, async () => {
        await deflateDecompressor.fromUint8Array(deflatedUint8Array);
      }),
      benchOptions
    );
  });
});
