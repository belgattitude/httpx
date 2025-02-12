import { bench } from 'vitest';

import { createStableKeyOrThrow } from '../src';

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
    { iterations: 10 }
  );
  bench(
    'createStableKeyOrThrow without array sorting',
    () => {
      createStableKeyOrThrow(params, {
        sortArrayValues: false,
      });
    },
    { iterations: 10 }
  );
});
