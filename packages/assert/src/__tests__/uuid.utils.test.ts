import { uuidsTestData } from '../../test/test.data';
import { getUuidVersion } from '../uuid.helpers';

describe('uuid utils tests', () => {
  describe('getUuidVersion', () => {
    it.each([
      [null, false as unknown as string],
      [null, new Date() as unknown as string],
      [1, uuidsTestData.v1],
      [3, uuidsTestData.v3],
      [4, uuidsTestData.v4],
      [5, uuidsTestData.v5],
      [7, uuidsTestData.v7],
    ])("should return %s when '%s' is given", (expected, value) => {
      expect(getUuidVersion(value)).toBe(expected);
    });
  });
});
