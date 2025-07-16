import { expectTypeOf } from 'vitest';

import type { SupportedCacheValues } from '../types';

describe('Types tests', () => {
  describe('SupportedCacheValues', () => {
    it('should allow supported types', () => {
      const _string: SupportedCacheValues = 'string';
      const _number: SupportedCacheValues = 1;
      expectTypeOf(_string).toEqualTypeOf<string>();
      expectTypeOf(_number).toEqualTypeOf<number>();
    });
    // eslint-disable-next-line @vitest/expect-expect
    it('should not allow unsupported types', () => {
      // @ts-expect-error - should not allow undefined
      const _undefined: SupportedCacheValues = undefined;
      // @ts-expect-error - should not allow promises
      const _async: SupportedCacheValues = new Promise(() => {});
    });
  });
});
