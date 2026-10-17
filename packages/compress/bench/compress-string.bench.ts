import { describe, test } from "vitest";

import { benchConfig } from "./bench-config";

describe(`Compressor`, () => {
  const { gzipCompressor, deflateCompressor, benchOptions, longString, sizes } =
    benchConfig;

  test(`Compressor.toEncodedString`, async ({ bench }) => {
    await bench.compare(
      bench(`Compressor('gzip').toEncodedString/base64 (original: ${sizes.original} / compressed: ${sizes.gzip})`, async () => {
        await gzipCompressor.toEncodedString(longString, {
          encoding: "base64",
        });
      }),
      bench(`Compressor('gzip').toEncodedString/base64_urlsafe (original: ${sizes.original} / compressed: ${sizes.gzip})`, async () => {
        await gzipCompressor.toEncodedString(longString, {
          encoding: "base64_urlsafe",
        });
      }),
      bench(`Compressor('deflate').toEncodedString/base64 (original: ${sizes.original} / compressed: ${sizes.deflate})`, async () => {
        await deflateCompressor.toEncodedString(longString, {
          encoding: "base64",
        });
      }),
      bench(`Compressor('deflate').toEncodedString/base64_urlsafe (original: ${sizes.original} / compressed: ${sizes.deflate})`, async () => {
        await deflateCompressor.toEncodedString(longString, {
          encoding: "base64_urlsafe",
        });
      }),
      benchOptions
    );
  });
});
