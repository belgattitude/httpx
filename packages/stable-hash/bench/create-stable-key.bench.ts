import { bench } from 'vitest';

import { createStableKey } from '../src';

describe(`createStableKey`, async () => {
  const params = {
    key8: true,
    key7: 'string',
    strArr: Array.from({ length: 10 }, (_, i) => i.toString()).toReversed(),
    plainObject: {
      key1: 'string',
    },
  };
  bench('createStableKey with array sorting', () => {
    createStableKey(params);
  });
});
