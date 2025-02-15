import prettyBytes from 'pretty-bytes';
import { bench, describe } from 'vitest';

import { Compressor, Decompressor } from '../src';

const benchOptions = {
  iterations: 4,
};

describe(`Decompressor`, async () => {
  const longString = `😊-abcdef-éàù-012345`.repeat(500_000);

  const size = prettyBytes(longString.length);

  const compressor = new Compressor('gzip');
  const compressedLongString = await compressor.toEncodedString(longString, {
    encoding: 'base64',
  });
  const compressedUint8Array = await compressor.toUint8Array(longString);
  const decompressor = new Decompressor('gzip');
  bench(
    `fromUint8Array (compressed size: ${prettyBytes(compressedUint8Array.byteLength)} / total: ${size})`,
    async () => {
      await decompressor.fromUint8Array(compressedUint8Array);
    },
    benchOptions
  );

  bench(
    `fromEncodedString (compressed size: ${prettyBytes(compressedLongString.length)} / total: ${size})`,
    async () => {
      await decompressor.fromEncodedString(compressedLongString);
    },
    benchOptions
  );
});
