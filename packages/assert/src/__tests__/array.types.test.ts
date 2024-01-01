import { assertType } from 'vitest';

import { assertArrayNonEmpty } from '../array.asserts';
import type { ArrayNonEmpty } from '../array.types';

describe('array types tests', () => {
  describe('assertArrayNonEmpty', () => {
    it('should return a type ArrayNonEmpty compatible with array', () => {
      const arr = [0];
      assertArrayNonEmpty(arr);
      expectTypeOf(arr).toBeArray();
      assertType<ArrayNonEmpty>(arr);
    });
  });
});
