import { describe, expect, it } from 'vitest';

import {
  isStrNotEmpty,
  isStrParsableSafeInt,
  isStrParsableStrictIsoDateZ,
} from '../string.guards';

describe('Typeguards string tests', () => {
  describe('isStrParsableIsoStrictDateZ', () => {
    it.each([
      [true, new Date().toISOString()],
      [true, '2023-12-29T23:37:31.653Z'],
      [true, '2023-12-29T23:37:31.653z'],
      [true, '2023-12-29t23:37:31.653z'],
      [true, '2500-12-29t23:37:31.653z'], // support for year 2500
      [true, '1910-12-29t23:37:31.653z'], // support for year below 1910
      [false, '2100-12-29t25:37:31.653z'], // no support hour 25
      [false, '2023-02-29T23:37:31.653z'], // no 29/02 in 2023
      [false, '2023-12-29t23:37:70.653z'], // no support for seconds 70
      [false, '2023-12-29T23:37:31.653'],
      [false, '2023-12-29T23:37:31?653z'],
      [false, 0],
    ])('should return %s when %s(/%s) is given', (expected, v) => {
      expect(isStrParsableStrictIsoDateZ(v)).toBe(expected);
    });
  });
  describe('isStrParsableSafeInt', () => {
    it.each([
      [true, '123'],
      [true, `${Number.MAX_SAFE_INTEGER}`],
      [true, `${Number.MIN_SAFE_INTEGER}`],
      [true, '-1111111'],
      [false, '10n'],
      [false, 10n],
      [false, `${Number.MIN_SAFE_INTEGER - 1}`],
    ])('should return %s when %s is given', (expected, v) => {
      expect(isStrParsableSafeInt(v)).toBe(expected);
    });
  });
  describe('isStrNotEmpty', () => {
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
});
