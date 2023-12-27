import { describe } from 'vitest';

import { uuidsTestData } from '../../../test/test.data';
import type { UuidVersion } from '../../types';
import {
  isUuid,
  isUuidV1,
  isUuidV3,
  isUuidV4,
  isUuidV5,
  isUuidVersion,
} from '../uuid.guards';

describe('Uuid typeguards tests', () => {
  describe('isUuid', () => {
    it.each([
      [true, 1, uuidsTestData.v1],
      [true, 3, uuidsTestData.v3],
      [true, 4, uuidsTestData.v4],
      [true, 5, uuidsTestData.v5],
      [true, undefined, uuidsTestData.v1],
      [true, undefined, uuidsTestData.v3],
      [true, undefined, uuidsTestData.v4],
      [true, undefined, uuidsTestData.v5],
      [false, 6, uuidsTestData.v5],
      [false, 5, 'A90123e1c-7512-523e-bb28-76fab9f2f73d'],
      [false, 5, ' 90123e1c-7512-523e-bb28-76fab9f2f73d'],
      [false, 5, new Date() as unknown as string],
      [false, Number.NaN, uuidsTestData.v5],
      [false, false, uuidsTestData.v5],
    ])(
      'isUuid should return %s when version is %s and value is %s',
      (expected, version, v) => {
        expect(isUuid(v, version as UuidVersion | undefined)).toBe(expected);
      }
    );
  });

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

  describe('isUuidVx', () => {
    it('should return true for isUuidV1 and valid uuid v1', () => {
      expect(isUuidV1(uuidsTestData.v1)).toBe(true);
    });
    it('should return true for isUuidV3 and valid uuid v3', () => {
      expect(isUuidV3(uuidsTestData.v3)).toBe(true);
    });
    it('should return true for isUuidV4 and valid uuid v4', () => {
      expect(isUuidV4(uuidsTestData.v4)).toBe(true);
    });
    it('should return true for isUuidV5 and valid uuid v5', () => {
      expect(isUuidV5(uuidsTestData.v5)).toBe(true);
    });
  });
});
