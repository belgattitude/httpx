import { describe, expect, it } from 'vitest';

import { isUuidVersion } from '../uuid.guards';
import type { UuidVersion } from '../uuid.types';

describe('Uuid typeguards tests', () => {
  describe('isUuidVersion', () => {
    it.each([
      [true, 1],
      [true, 3],
      [true, 4],
      [true, 5],
      [false, 6],
      [false, Number.NaN],
      [false, {}],
    ])(
      'isUuidVersion should return %s when version is %s and value is %s',
      (expected, v) => {
        expect(isUuidVersion(v as UuidVersion | undefined)).toBe(expected);
      }
    );
  });
});
