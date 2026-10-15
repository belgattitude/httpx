import prettyBytes from "pretty-bytes";
import { describe, test } from "vitest";

import { benchConfig } from "./bench-config";

describe(`Compressor`, () => {
  const { gzipCompressor, deflateCompressor, benchOptions, longString } =
    benchConfig;

  const size = prettyBytes(longString.length);

  test(`Compressor.toEncodedString`, async ({ bench }) => {
    await bench.compare(
      bench(`Compressor('gzip').toEncodedString/base64 (original size: ${size})`, async () => {
        await gzipCompressor.toEncodedString(longString, {
          encoding: "base64",
        });
      }),
      bench(`Compressor('gzip').toEncodedString/base64_urlsafe (original size: ${size})`, async () => {
        await gzipCompressor.toEncodedString(longString, {
          encoding: "base64_urlsafe",
        });
      }),
      bench(`Compressor('deflate').toEncodedString/base64 (original size: ${size})`, async () => {
        await deflateCompressor.toEncodedString(longString, {
          encoding: "base64",
        });
      }),
      bench(`Compressor('deflate').toEncodedString/base64-url_safe (original size: ${size})`, async () => {
        await deflateCompressor.toEncodedString(longString, {
          encoding: "base64_urlsafe",
        });
      }),
      benchOptions
    );
  });
});
