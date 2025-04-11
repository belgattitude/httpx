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

  const gzippedUint8Array = await gzipCompressor.toUint8Array(longString);

  const deflatedUint8Array = await deflateCompressor.toUint8Array(longString);

  bench(
    `Decompressor('gzip').fromUint8Array (compressed size: ${prettyBytes(gzippedUint8Array.byteLength)} / total: ${size})`,
    async () => {
      await gzipDecompressor.fromUint8Array(gzippedUint8Array);
    },
    benchOptions
  );

  bench(
    `Decompressor('deflate').fromUint8Array (compressed size: ${prettyBytes(deflatedUint8Array.byteLength)} / total: ${size})`,
    async () => {
      await deflateDecompressor.fromUint8Array(deflatedUint8Array);
    },
    benchOptions
  );
});
