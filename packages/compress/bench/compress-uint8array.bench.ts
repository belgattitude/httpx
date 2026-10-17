import { describe, test } from "vitest";

import { benchConfig } from "./bench-config";

describe(`Compressor`, () => {
  const { gzipCompressor, deflateCompressor, benchOptions, longString, sizes } =
    benchConfig;

  test(`Compressor.toUint8Array`, async ({ bench }) => {
    await bench.compare(
      bench(`Compressor('gzip').toUint8Array (original: ${sizes.original} / compressed: ${sizes.gzip})`, async () => {
        await gzipCompressor.toUint8Array(longString);
      }),
      bench(`Compressor('deflate').toUint8Array (original: ${sizes.original} / compressed: ${sizes.deflate})`, async () => {
        await deflateCompressor.toUint8Array(longString);
      }),
      benchOptions
    );
  });
});
