import * as jsBase64 from 'js-base64';
import prettyBytes from 'pretty-bytes';
import { bench, describe } from 'vitest';

import { Base64NodeJs } from '../src/base64/base64.nodejs';
import { Base64Purejs } from '../src/base64/base64.purejs';
import { benchConfig } from './bench-config';

describe(`Compare`, async () => {
  const { benchOptions, longString } = benchConfig;

  const size = prettyBytes(longString.length);

  bench(
    `@httpx/base64.encode (Node.Buffer - original size: ${size})`,
    () => {
      Base64NodeJs.encode(longString);
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
      jsBase64.encode(longString);
    },
    benchOptions
  );
});
