import prettyBytes from "pretty-bytes";
import { describe, test } from "vitest";

import { benchConfig } from "./bench-config";

describe(`Compressor`, () => {
  const { gzipCompressor, deflateCompressor, benchOptions, longString } =
    benchConfig;

  const size = prettyBytes(longString.length);

  test(`Compressor.toUint8Array`, async ({ bench }) => {
    await bench.compare(
      bench(`Compressor('gzip').toUint8Array (original size: ${size})`, async () => {
        await gzipCompressor.toUint8Array(longString);
      }),
      bench(`Compressor('deflate').toUint8Array (original size: ${size})`, async () => {
        await deflateCompressor.toUint8Array(longString);
      }),
      benchOptions
    );
  });
});
