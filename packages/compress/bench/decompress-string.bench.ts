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

  test(`Decompressor.fromEncodedString`, async ({ bench }) => {
    const gzippedLongString = await gzipCompressor.toEncodedString(longString, {
      encoding: "base64",
    });

    const deflatedLongString = await deflateCompressor.toEncodedString(
      longString,
      {
        encoding: "base64",
      }
    );

    await bench.compare(
      bench(`Decompressor('gzip').fromEncodedString (compressed size: ${prettyBytes(gzippedLongString.length)} / total: ${size})`, async () => {
        await gzipDecompressor.fromEncodedString(gzippedLongString);
      }),
      bench(`Decompressor('deflate').fromEncodedString (compressed size: ${prettyBytes(deflatedLongString.length)} / total: ${size})`, async () => {
        await deflateDecompressor.fromEncodedString(deflatedLongString);
      }),
      benchOptions
    );
  });
});
