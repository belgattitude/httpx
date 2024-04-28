import { describe, expect, it } from 'vitest';

import { isNetworkPort } from '../network.guards';

describe('Network typeguards tests', () => {
  describe('isNetworkPort', () => {
    it.each([
      [false, null],
      [false, undefined],
      [false, 128_000],
      [false, BigInt(10)],
      [false, new Date()],
      [true, 0],
      [true, 65_535],
      [true, 80],
    ])('should return %s when %s is given', (expected, v) => {
      expect(isNetworkPort(v)).toBe(expected);
    });
  });
});
