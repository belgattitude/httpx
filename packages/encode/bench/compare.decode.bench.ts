import prettyBytes from 'pretty-bytes';
import { bench, describe } from 'vitest';

import { Base64NodeJs } from '../src/base64/base64.nodejs';
import { benchConfig } from './bench-config';

describe(`Compare`, async () => {
  const { benchOptions, longString } = benchConfig;

  const size = prettyBytes(longString.length);

  const encoded = Base64NodeJs.encode(longString);
  bench(
    `decode (original size: ${size})`,
    () => {
      Base64NodeJs.decode(encoded);
    },
    benchOptions
  );
});
