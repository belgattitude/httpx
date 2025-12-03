import { describe, expect, it } from 'vitest';

import {
  isParsableSafeInt,
  isParsableStrictIsoDateZ,
  isStringNonEmpty,
} from '../string.guards';

describe('Typeguards string tests', () => {
  describe('isParsableStrictIsoDateZ', () => {
    it.each([
      [true, new Date().toISOString()],
      [true, '2023-12-29T23:37:31.653Z'],
      [true, '2023-12-29T23:37:31.653z'], // Accept case-insensitive
      [true, '2023-12-29t23:37:31.653Z'], // Accept case-insensitive
      [true, '2023-12-29t23:37:31.653z'], // Accept case-insensitive
      [true, '2023-12-29T23:37:31.653Z'],
      [true, '2500-12-29T23:37:31.653Z'], // support for year 2500
      [true, '1910-12-29T23:37:31.653Z'], // support for year below 1910
      [false, '2100-12-29T25:37:31.653Z'], // no support hour 25
      [false, '2023-02-29T23:37:31.653Z'], // no 29/02 in 2023
      [false, '2023-12-29t23:37:70.653Z'], // no support for seconds 70
      [false, '2023-12-29T23:37:31.653'], // Missing 'Z' suffix
      [false, '2023-12-29T23:37:31?653Z'], // Invalid character
      [false, 0],
      [false, Number.NaN],
      [false, undefined],
      [false, null],
    ] as const)('should return %s when %s(/%s) is given', (expected, v) => {
      expect(isParsableStrictIsoDateZ(v)).toBe(expected);
    });
    it('should return the iso date with lowercase z as uppercase', () => {
      expect(new Date('2023-12-29t23:37:31.653z').toISOString()).toBe(
        '2023-12-29T23:37:31.653Z'
      );
    });
  });
  describe('isParsableSafeInt', () => {
    it.each([
      [true, '123'],
      [true, `${Number.MAX_SAFE_INTEGER}`],
      [true, `${Number.MIN_SAFE_INTEGER}`],
      [true, '-1111111'],
      [false, '10n'],
      [false, 10n],
      [false, `${Number.MIN_SAFE_INTEGER - 1}`],
    ])('should return %s when %s is given', (expected, v) => {
      expect(isParsableSafeInt(v)).toBe(expected);
    });
  });
  describe('isStringNonEmpty', () => {
    it.each([
      [true, 'cool'],
      [false, 1],
      [false, '  '],
      [false, ''],
      [false, null],
      [false, undefined],
      [false, {}],
    ])('should return %s when %s is given', (expected, v) => {
      expect(isStringNonEmpty(v)).toBe(expected);
    });
  });
});
