import { encode as jsBase64Encode } from 'js-base64';
import prettyBytes from 'pretty-bytes';
import { bench, describe } from 'vitest';

import { Base64 } from '../src/base64';
import { benchConfig } from './bench-config';

describe(`Compare`, async () => {
  const { benchOptions, longString } = benchConfig;

  const size = prettyBytes(longString.length);

  bench(
    `@httpx/base64.encode (original size: ${size})`,
    () => {
      Base64.encode(longString);
    },
    benchOptions
  );

  bench(
    `@httpx/encode.encodeNodeJs (original size: ${size})`,
    () => {
      Base64.encodeNodeJs(longString);
    },
    benchOptions
  );

  bench(
    `js-base64.encode (original size: ${size})`,
    () => {
      jsBase64Encode(longString);
    },
    benchOptions
  );
});
