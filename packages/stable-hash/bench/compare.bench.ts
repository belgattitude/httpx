import { hashKey } from '@tanstack/query-core';
import hash from 'stable-hash';
import { bench } from 'vitest';

import { benchConfig } from './bench-config';
import { loadCreateStableKeyOrThrow } from './bench-utils';

describe(`Comparison`, async () => {
  const createStableKeyOrThrow = await loadCreateStableKeyOrThrow();
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
    benchConfig.benchOptions
  );
  bench(
    'stable-hash',
    () => {
      hash(params);
    },
    benchConfig.benchOptions
  );
  bench(
    '@tanstack/query-core (hashKey)',
    () => {
      hashKey([params]);
    },
    benchConfig.benchOptions
  );
});
