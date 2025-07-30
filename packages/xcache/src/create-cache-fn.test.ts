import { TimeLruCache } from '@httpx/lru';
import { expect, expectTypeOf } from 'vitest';

import { createCacheFn } from './create-cache-fn';

describe('createCacheFn', () => {
  const asyncFn = async (params: { name: string }) => ({
    message: `Hello "${params.name}"`,
  });

  it('should cache', async () => {
    const withCache = createCacheFn({
      lru: new TimeLruCache({
        maxSize: 100,
        defaultTTL: 10,
      }),
      namespace: 'test',
    });

    const { data } = await withCache({
      key: ['test-async-fn'],
      fn: () => asyncFn({ name: 'World' }),
    });
    expect(data).toEqual({ message: 'Hello "World"' });
    expectTypeOf(data).toEqualTypeOf<{
      message: string;
    }>();
  });
});
