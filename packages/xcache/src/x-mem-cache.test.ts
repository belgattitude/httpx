import { TimeLruCache } from '@httpx/lru';
import { expectTypeOf } from 'vitest';

import { XMemCache } from './x-mem-cache';

it('should work', () => {
  type Params = {
    name: string;
  };
  const testFn = async (params: Params) => {
    return {
      message: `Hello ${params.name}`,
    };
  };
  const params: Params = {
    name: 'test',
  };

  describe('new api', async () => {
    const lru = new TimeLruCache({
      maxSize: 50,
      defaultTTL: 1000,
    });

    const xMemCache = new XMemCache({
      lru,
      keyPrefix: 'test',
    });

    const cached = await xMemCache.withCache({
      key: ['/api/test', params],
      fn: () => {
        return testFn(params);
      },
    });

    const { data } = cached;
    expectTypeOf(data).toEqualTypeOf<{
      message: string;
    }>();
  });
});
