import prettyBytes from 'pretty-bytes';
import { bench, describe } from 'vitest';

import { benchConfig } from './bench-config';

const {
  deflateDecompressor,
  gzipDecompressor,
  gzipCompressor,
  deflateCompressor,
  benchOptions,
  longString,
} = benchConfig;

describe(`Decompressor`, async () => {
  const size = prettyBytes(longString.length);

  const gzippedLongString = await gzipCompressor.toEncodedString(longString, {
    encoding: 'base64',
  });

  const deflatedLongString = await deflateCompressor.toEncodedString(
    longString,
    {
      encoding: 'base64',
    }
  );

  bench(
    `Decompressor('gzip').fromEncodedString (compressed size: ${prettyBytes(gzippedLongString.length)} / total: ${size})`,
    async () => {
      await gzipDecompressor.fromEncodedString(gzippedLongString);
    },
    benchOptions
  );

  bench(
    `Decompressor('deflate').fromEncodedString (compressed size: ${prettyBytes(deflatedLongString.length)} / total: ${size})`,
    async () => {
      await deflateDecompressor.fromEncodedString(deflatedLongString);
    },
    benchOptions
  );
});
