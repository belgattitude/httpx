import { hashKey } from '@tanstack/query-core';
import hash from 'stable-hash';
import { hash as stableHashX } from 'stable-hash-x';
import { bench } from 'vitest';

import { createStableKeyOrThrow } from '../src';
import { benchConfig } from './bench-config';

describe(`Comparison`, async () => {
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
    'stable-hash-x',
    () => {
      stableHashX(params);
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
