import { bench } from 'vitest';

import { createStableKeyOrThrow } from '../src';
import { benchConfig } from './bench-config';

describe(`createStableKeyOrThrow`, async () => {
  const params = {
    key8: true,
    key7: 'string',
    strArr: Array.from({ length: 10 }, (_, i) => i.toString()).toReversed(),
    plainObject: {
      key1: 'string',
    },
  };
  bench(
    'createStableKeyOrThrow with array sorting',
    () => {
      createStableKeyOrThrow(params);
    },
    benchConfig.benchOptions
  );
  bench(
    'createStableKeyOrThrow without array sorting',
    () => {
      createStableKeyOrThrow(params, {
        sortArrayValues: false,
      });
    },
    benchConfig.benchOptions
  );
});
