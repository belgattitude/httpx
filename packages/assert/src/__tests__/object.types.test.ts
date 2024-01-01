import { assertType } from 'vitest';

import { assertPlainObject } from '../object.asserts';
import type { PlainObject } from '../object.types';

describe('object types tests', () => {
  describe('isPlainObject', () => {
    it('should return a type PlainObject compatible with object', () => {
      const po = {};
      assertPlainObject(po);
      assertType<PlainObject>(po);
      assertType<Record<string | number | symbol, unknown>>(po);
    });
  });
});
