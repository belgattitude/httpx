import prettyBytes from 'pretty-bytes';
import { bench, describe } from 'vitest';

import { benchConfig } from './bench-config';

describe(`Compressor`, async () => {
  const { gzipCompressor, deflateCompressor, benchOptions, longString } =
    benchConfig;

  const size = prettyBytes(longString.length);

  bench(
    `Compressor('gzip').toEncodedString/base64 (original size: ${size})`,
    async () => {
      await gzipCompressor.toEncodedString(longString, {
        encoding: 'base64',
      });
    },
    benchOptions
  );

  bench(
    `Compressor('gzip').toEncodedString/base64_urlsafe (original size: ${size})`,
    async () => {
      await gzipCompressor.toEncodedString(longString, {
        encoding: 'base64_urlsafe',
      });
    },
    benchOptions
  );

  bench(
    `Compressor('deflate').toEncodedString/base64 (original size: ${size})`,
    async () => {
      await deflateCompressor.toEncodedString(longString, {
        encoding: 'base64',
      });
    },
    benchOptions
  );

  bench(
    `Compressor('deflate').toEncodedString/base64-url_safe (original size: ${size})`,
    async () => {
      await deflateCompressor.toEncodedString(longString, {
        encoding: 'base64_urlsafe',
      });
    },
    benchOptions
  );
});
