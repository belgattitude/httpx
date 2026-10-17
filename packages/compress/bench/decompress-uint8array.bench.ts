import { describe, test } from "vitest";

import { benchConfig } from "./bench-config";

const {
  deflateDecompressor,
  gzipDecompressor,
  benchOptions,
  compressed,
  sizes,
} = benchConfig;

describe(`Decompressor`, () => {
  test(`Decompressor.fromUint8Array`, async ({ bench }) => {
    await bench.compare(
      bench(`Decompressor('gzip').fromUint8Array (compressed: ${sizes.gzip} / original: ${sizes.original})`, async () => {
        await gzipDecompressor.fromUint8Array(compressed.gzip.uint8Array);
      }),
      bench(`Decompressor('deflate').fromUint8Array (compressed: ${sizes.deflate} / original: ${sizes.original})`, async () => {
        await deflateDecompressor.fromUint8Array(compressed.deflate.uint8Array);
      }),
      benchOptions
    );
  });
});
