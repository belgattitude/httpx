import hash from 'stable-hash';
import { bench } from 'vitest';

import type { createStableKey as Src } from '../src/create-stable-key';

const loadCreateStableKey = async () =>
  await import(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore to apply benchmarks assert must be built
    // eslint-disable-next-line import-x/no-unresolved
    '@httpx/stable-hash'
  )
    .then((mod) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
      return mod.createStableKey as unknown as typeof Src;
    })
    .catch((_e) => {
      const msg = 'Requires httpx/stable-key to be built (yarn build)';
      throw new Error(msg);
    });

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
  bench('@httpx/stable-hash', () => {
    createStableKey(params, {
      sortArrayValues: false,
    });
  });
  bench('stable-hash', () => {
    hash(params);
  });
});
