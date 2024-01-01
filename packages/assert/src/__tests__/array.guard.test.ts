import { describe, expect, it } from 'vitest';

import { isArrayNonEmpty } from '../array.guards';

describe('Array typeguards tests', () => {
  describe('isArrayNotEmpty', () => {
    it.each([
      [false, []],
      [false, Array.from([])],
      [false, new Date()],
      [true, Array.from(['cool'])],
      [true, ['cool']],
    ])('should return %s when %s is given', (expected, v) => {
      expect(isArrayNonEmpty(v)).toBe(expected);
    });
  });
});
