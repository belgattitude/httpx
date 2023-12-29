import { assertStrNotEmpty, assertStrParsableSafeInt } from '../string.asserts';

describe('string assertions tests', () => {
  describe('assertStrParsableSafeInt', () => {
    it('should not throw when value is valid', () => {
      expect(() => assertStrParsableSafeInt('10')).not.toThrow();
    });
    it('should throw when value is invalid', () => {
      expect(() => assertStrParsableSafeInt(10)).toThrow(
        new TypeError(
          'Value is expected to be a string containing a safe integer, got: number(length:2)'
        )
      );
    });
    it('should throw custom error when value is invalid', () => {
      const e = new Error('cool');
      expect(() => assertStrParsableSafeInt('', () => e)).toThrow(e);
    });
  });
  describe('assertStrNotEmpty', () => {
    it('should not throw when value is valid', () => {
      expect(() => assertStrNotEmpty('sdf')).not.toThrow();
    });
    it('should throw when value is invalid', () => {
      expect(() => assertStrNotEmpty(new Date())).toThrow(
        new TypeError(
          'Value is expected to be a non-empty string (with trim: true), got: Date'
        )
      );
    });
    it('should throw when value is only empty chars', () => {
      expect(() =>
        assertStrNotEmpty('   ', undefined, {
          trim: true,
        })
      ).toThrow(
        new TypeError(
          'Value is expected to be a non-empty string (with trim: true), got: string(3)'
        )
      );
    });
    it('should throw custom error when value is invalid', () => {
      const e = new Error('cool');
      expect(() => assertStrNotEmpty('', () => e)).toThrow(e);
    });
  });
});
