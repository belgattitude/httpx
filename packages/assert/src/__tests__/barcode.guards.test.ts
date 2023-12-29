import { eansTestData } from '../../test/test.data';
import { isEan13 } from '../barcode.guards';

describe('Barcode guards tests', () => {
  describe('isEan13', () => {
    it('should return false when length !== 13', () => {
      expect(isEan13('123456789012')).toBe(false);
      expect(isEan13(null)).toBe(false);
    });
    it('should return true if length = 13 && checkdigit correct', () => {
      expect(isEan13(eansTestData.ean13)).toBe(true);
    });
    it('should return false when checkdigit is incorrect', () => {
      expect(isEan13('1234567890129')).toBe(false);
    });
  });
});
