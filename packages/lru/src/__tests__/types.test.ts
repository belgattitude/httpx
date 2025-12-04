import { expectTypeOf } from 'vitest';

import { LruCache } from '../lru-cache';
import { TimeLruCache } from '../time-lru-cache';
import type { SupportedCacheValues } from '../types';

describe('Types tests', () => {
  describe('LruCache: when typing values', () => {
    type EnforcedValue = { props: boolean };
    const lru = new LruCache<EnforcedValue>({ maxSize: 10 });
    it('should type the results of get and set operations', () => {
      lru.set('typecheck-accepted-key', { props: true });
      expectTypeOf(
        lru.get('typecheck-accepted-key')!
      ).toEqualTypeOf<EnforcedValue>();
    });
    // eslint-disable-next-line @vitest/expect-expect
    it('should error when setting wrong value types', () => {
      // @ts-expect-error - should not allow wrong value types
      lru.set('typecheck-error', true);
    });
  });
  describe('TimeLruCache: when typing values', () => {
    type EnforcedValue = { props: boolean };
    const lru = new TimeLruCache<EnforcedValue>({
      maxSize: 10,
      defaultTTL: 1000,
    });
    it('should type the results of get and set operations', () => {
      lru.set('typecheck-accepted-key', { props: true });
      expectTypeOf(
        lru.get('typecheck-accepted-key')!
      ).toEqualTypeOf<EnforcedValue>();
    });
    // eslint-disable-next-line @vitest/expect-expect
    it('should error when setting wrong value types', () => {
      // @ts-expect-error - should not allow wrong value types
      lru.set('typecheck-error', true);
    });
  });

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
