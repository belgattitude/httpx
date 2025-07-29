import { expectTypeOf } from 'vitest';

import { withCache } from './x-cache.types';

it('should export XMemCache', async () => {
  const { data, meta } = await withCache({
    key: ['/api/test', { name: 'test' }],
    fn: (params) => {
      const { key } = params;
      return Promise.resolve({ message: `Hello test ${JSON.stringify(key)}` });
    },
  });
  expect(data).toStrictEqual({
    message: 'Hello test ["/api/test",{"name":"test"}]',
  });
  expectTypeOf(data).toEqualTypeOf<{
    message: string;
  }>();
  expectTypeOf(meta).toEqualTypeOf<{
    cached: boolean;
  }>();
});
