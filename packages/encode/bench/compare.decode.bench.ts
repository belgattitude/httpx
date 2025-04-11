import prettyBytes from 'pretty-bytes';
import { bench, describe } from 'vitest';

import { Base64 } from '../src/base64';
import { benchConfig } from './bench-config';

describe(`Compare`, async () => {
  const { benchOptions, longString } = benchConfig;

  const size = prettyBytes(longString.length);

  const encoded = Base64.encode(longString);
  bench(
    `decode (original size: ${size})`,
    () => {
      Base64.decodeNodeJs(encoded);
    },
    benchOptions
  );
});
