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
  test(`Decompressor.fromEncodedString`, async ({ bench }) => {
    await bench.compare(
      bench(`Decompressor('gzip').fromEncodedString/base64 (compressed: ${sizes.gzip} / original: ${sizes.original})`, async () => {
        await gzipDecompressor.fromEncodedString(compressed.gzip.base64);
      }),
      bench(`Decompressor('gzip').fromEncodedString/base64_urlsafe (compressed: ${sizes.gzip} / original: ${sizes.original})`, async () => {
        await gzipDecompressor.fromEncodedString(
          compressed.gzip.base64UrlSafe,
          {
            encoding: "base64_urlsafe",
          }
        );
      }),
      bench(`Decompressor('deflate').fromEncodedString/base64 (compressed: ${sizes.deflate} / original: ${sizes.original})`, async () => {
        await deflateDecompressor.fromEncodedString(compressed.deflate.base64);
      }),
      bench(`Decompressor('deflate').fromEncodedString/base64_urlsafe (compressed: ${sizes.deflate} / original: ${sizes.original})`, async () => {
        await deflateDecompressor.fromEncodedString(
          compressed.deflate.base64UrlSafe,
          { encoding: "base64_urlsafe" }
        );
      }),
      benchOptions
    );
  });
});
