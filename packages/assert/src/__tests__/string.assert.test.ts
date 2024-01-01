import {
  assertStrNotEmpty,
  assertStrParsableSafeInt,
  assertStrParsableStrictIsoDateZ,
} from '../string.asserts';

describe('string assertions tests', () => {
  describe('assertStrParsableStrictIsoDateZ', () => {
    it('should not throw when value is valid', () => {
      expect(() =>
        assertStrParsableStrictIsoDateZ(new Date().toISOString())
      ).not.toThrow();
    });
    it.each([
      [
        'Value is expected to be a string containing a strict iso date (INVALID_FORMAT), got: string(length:1)',
        'A',
      ],
      [
        'Value is expected to be a string containing a strict iso date (INVALID_DATE), got: string(length:24)',
        '2023-02-29T23:37:31.653z', // no 29th feb in 2023
      ],
      [
        'Value is expected to be a string containing a strict iso date, got: Date',
        new Date(),
      ],
    ])('should throw with message %s when value is %s', (msg, v) => {
      expect(() => assertStrParsableStrictIsoDateZ(v)).toThrow(
        new TypeError(msg)
      );
    });
  });
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
        new TypeError('Value is expected to be a non-empty string, got: Date')
      );
    });
    it('should throw custom error when value is invalid', () => {
      const e = new Error('cool');
      expect(() => assertStrNotEmpty('', () => e)).toThrow(e);
    });
  });
});
