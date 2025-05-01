import { expectTypeOf } from 'vitest';

import type { SupportedCacheValues } from '../types';

describe('Types tests', () => {
  describe('SupportedCacheValues', () => {
    it('should pass', () => {
      const _str: SupportedCacheValues = 'string';
      expectTypeOf(_str).toEqualTypeOf<string>();

      // @ts-expect-error - should not allow undefined
      const _undefined: SupportedCacheValues = undefined;

      const _object: SupportedCacheValues = new Intl.Locale('en');

      // @ts-expect-error - should not allow promises
      const _async: SupportedCacheValues = new Promise(() => {});
    });
  });
});
