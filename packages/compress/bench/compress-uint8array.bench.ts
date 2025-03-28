import prettyBytes from 'pretty-bytes';
import { bench, describe } from 'vitest';

import { benchConfig } from './bench-config';

describe(`Compressor`, async () => {
  const { gzipCompressor, deflateCompressor, benchOptions, longString } =
    benchConfig;

  const size = prettyBytes(longString.length);

  bench(
    `Compressor('gzip').toUint8Array (original size: ${size})`,
    async () => {
      await gzipCompressor.toUint8Array(longString);
    },
    benchOptions
  );

  bench(
    `Compressor('deflate').toUint8Array (original size: ${size})`,
    async () => {
      await deflateCompressor.toUint8Array(longString);
    },
    benchOptions
  );
});
