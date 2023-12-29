import { describe, expect, it } from 'vitest';

import { isStrNotEmpty, isStrParsableSafeInt } from '../string.guards';

describe('Typeguards string tests', () => {
  describe('isStrParsableSafeInt', () => {
    it.each([
      [true, '123'],
      [true, `${Number.MAX_SAFE_INTEGER}`],
      [true, `${Number.MIN_SAFE_INTEGER}`],
      [true, '-1111111'],
      [false, '10n'],
    ])('should return %s when %s is given', (expected, v) => {
      expect(isStrParsableSafeInt(v)).toBe(expected);
    });
  });
  describe('isStrNotEmpty', () => {
    it('should trim by default', () => {
      expect(isStrNotEmpty('  ')).toStrictEqual(isStrNotEmpty(''));
    });
    describe('when trim === true (default)', () => {
      it.each([
        [true, 'cool'],
        [false, 1],
        [false, '  '],
        [false, ''],
        [false, null],
        [false, undefined],
        [false, {}],
      ])('should return %s when %s is given', (expected, v) => {
        expect(isStrNotEmpty(v)).toBe(expected);
      });
    });
    describe('when trim === false', () => {
      it('should work as expected', () => {
        expect(
          isStrNotEmpty('  ', {
            trim: false,
          })
        ).toBe(true);
      });
    });
  });
});
