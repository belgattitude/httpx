import prettyBytes from 'pretty-bytes';
import { bench, describe } from 'vitest';

import { Base64Node } from '../src/base64/base64.nodejs';
import { benchConfig } from './bench-config';

describe(`Compare`, async () => {
  const { benchOptions, longString } = benchConfig;

  const size = prettyBytes(longString.length);

  const encoded = Base64Node.encode(longString);
  bench(
    `decode (original size: ${size})`,
    () => {
      Base64Node.decode(encoded);
    },
    benchOptions
  );
});
