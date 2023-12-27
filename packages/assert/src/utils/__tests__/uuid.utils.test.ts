import { uuidsTestData } from '../../../test/test.data';
import { getUuidVersion } from '../../helpers';

describe('uuid utils tests', () => {
  describe('getUuidVersion', () => {
    it.each([
      [false, false as unknown as string],
      [false, new Date() as unknown as string],
      [1, uuidsTestData.v1],
      [3, uuidsTestData.v3],
      [4, uuidsTestData.v4],
      [5, uuidsTestData.v5],
    ])("should return %s when '%s' is given", (expected, value) => {
      expect(getUuidVersion(value)).toBe(expected);
    });
  });
});
