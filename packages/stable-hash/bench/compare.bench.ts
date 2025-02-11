import { hashKey } from '@tanstack/query-core';
import hash from 'stable-hash';
import { bench } from 'vitest';

import { loadcreateStableKeyOrThrow } from './utils';

describe(`Comparison`, async () => {
  const createStableKeyOrThrow = await loadcreateStableKeyOrThrow();
  const params = {
    key8: true,
    key7: 'string',
    strArr: Array.from({ length: 10 }, (_, i) => i.toString()).toReversed(),
    plainObject: {
      key1: 'string',
    },
  };
  bench(
    '@httpx/stable-hash',
    () => {
      createStableKeyOrThrow(params, {
        sortArrayValues: false,
      });
    },
    { iterations: 10 }
  );
  bench(
    'stable-hash',
    () => {
      hash(params);
    },
    { iterations: 10 }
  );
  bench(
    '@tanstack/query-core (hashKey)',
    () => {
      hashKey([params]);
    },
    { iterations: 10 }
  );
});
