import { expectTypeOf } from 'vitest';

import { withCache } from './x-cache.types';

it('should export XMemCache', async () => {
  const asyncFn = async (params: { name: string }) => {
    return {
      message: `Hello "${params.name}"`,
    };
  };
  const params = { name: 'test' };
  const { data, meta } = await withCache({
    key: ['/api/test', params],
    fn: ({ key }) => asyncFn(params),
  });
  expect(data).toStrictEqual({
    message: 'Hello "test"',
  });
  expectTypeOf(data).toEqualTypeOf<{
    message: string;
  }>();
  expectTypeOf(meta).toEqualTypeOf<{
    cached: boolean;
  }>();
});
