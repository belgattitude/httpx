import { describe, expect, it } from 'vitest';

import { isNumberSafeInt } from '../number.guards';

describe('Number typeguards tests', () => {
  describe('isNumberSafeInt', () => {
    it.each([
      [false, []],
      [false, BigInt(10)],
      [false, 10n],
      [false, new Date()],
      [true, Number.MIN_SAFE_INTEGER],
      [true, Number.MAX_SAFE_INTEGER],
      [true, 10],
    ])('should return %s when %s is given', (expected, v) => {
      expect(isNumberSafeInt(v)).toBe(expected);
    });
  });
});
