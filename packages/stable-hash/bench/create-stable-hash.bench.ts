import { bench } from 'vitest';

import { createStableHashOrThrow } from '../src/create-stable-hash-or-throw';

describe(`createStableHashOrThrow`, async () => {
  const params = {
    key8: true,
    key7: 'string',
    strArr: Array.from({ length: 10 }, (_, i) => i.toString()).toReversed(),
    plainObject: {
      key1: 'string',
    },
  };
  bench(
    'createStableHashOrThrow with array sorting',
    async () => {
      await createStableHashOrThrow(params);
    },
    { iterations: 10 }
  );
  bench(
    'createStableHashOrThrow without array sorting',
    async () => {
      await createStableHashOrThrow(params, {
        sortArrayValues: false,
      });
    },
    { iterations: 10 }
  );
});
