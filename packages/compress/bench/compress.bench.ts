import prettyBytes from 'pretty-bytes';
import { bench, describe } from 'vitest';

import { Compressor } from '../src';

const benchOptions = {
  iterations: 4,
};

describe(`Compressor`, async () => {
  const longString = `😊-abcdef-éàù-012345`.repeat(1_000_000);

  const size = prettyBytes(longString.length);

  const compressor = new Compressor('gzip');

  bench(
    `toUint8Array (original size: ${size})`,
    async () => {
      await compressor.toUint8Array(longString);
    },
    benchOptions
  );

  bench(
    `toEncodedString (original size: ${size})`,
    async () => {
      await compressor.toEncodedString(longString, 'base64');
    },
    benchOptions
  );
});
