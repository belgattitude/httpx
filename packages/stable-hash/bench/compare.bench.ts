import hash from 'stable-hash';
import { bench } from 'vitest';

import { loadCreateStableKey } from './utils';

describe(`Comparison`, async () => {
  const createStableKey = await loadCreateStableKey();
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
      createStableKey(params, {
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
});
