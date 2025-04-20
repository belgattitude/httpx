import { encode as jsBase64Encode } from 'js-base64';
import prettyBytes from 'pretty-bytes';
import { bench, describe } from 'vitest';

import { Base64Nodejs } from '../src/base64/base64.nodejs';
import { Base64Purejs } from '../src/base64/base64.purejs';
import { benchConfig } from './bench-config';

describe(`Compare`, async () => {
  const { benchOptions, longString } = benchConfig;

  const size = prettyBytes(longString.length);

  bench(
    `@httpx/base64.encode (Node.Buffer - original size: ${size})`,
    () => {
      Base64Nodejs.encode(longString);
    },
    benchOptions
  );

  bench(
    `@httpx/base64.encode (PureJs - original size: ${size})`,
    () => {
      Base64Purejs.encode(longString);
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
