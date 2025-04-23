import * as jsBase64 from 'js-base64';
import prettyBytes from 'pretty-bytes';
import { bench, describe } from 'vitest';

import { Base64NodeJs } from '../src/base64/base64.nodejs';
import { Base64Purejs } from '../src/base64/base64.purejs';
import { benchConfig } from './bench-config';

describe(`Compare`, async () => {
  const { benchOptions, longString } = benchConfig;

  const size = prettyBytes(longString.length);

  const encoded = Base64NodeJs.encode(longString);
  bench(
    `decode nodejs (original size: ${size})`,
    () => {
      Base64NodeJs.decode(encoded);
    },
    benchOptions
  );
  bench(
    `decode purejs (original size: ${size})`,
    () => {
      Base64Purejs.decode(encoded);
    },
    benchOptions
  );

  bench(
    `js-base64.decode (original size: ${size})`,
    () => {
      jsBase64.decode(longString);
    },
    benchOptions
  );
});
