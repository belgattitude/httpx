import { bench } from 'vitest';

import { genCacheKeyString } from '../src/cache-key';
import { benchConfig } from './bench-config';

const options = benchConfig.benchOptions;

describe(`genCacheKey benches`, () => {
  const params = {
    date: new Date(),
    bigint: BigInt('10'),
    string: 'test-string',
    number: 42,
    boolean: true,
  };

  bench(
    'original function',
    async () => {
      const _keyStr = genCacheKeyString({
        key: ['test', params],
        namespace: 'test-namespace',
      });
    },
    options
  );
});
