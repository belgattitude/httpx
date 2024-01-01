import { eansTestData } from '../../test/test.data';
import { assertEan13 } from '../barcode.asserts';

describe('barcode assertions tests', () => {
  it('should not throw when barcode is valid', () => {
    expect(() => assertEan13(eansTestData.ean13)).not.toThrow();
  });
  it('should throw when barcode is invalid', () => {
    expect(() => assertEan13('12345')).toThrow(
      new TypeError('Value is expected to be an ean13, got: string(length:5)')
    );
  });
  it('should throw custom error when barcode is invalid', () => {
    const e = new Error('cool');
    expect(() => assertEan13('12345', () => e)).toThrow(e);
  });
  describe('Types tests', () => {
    it('should return a type string', () => {
      const ean13 = eansTestData.ean13;
      assertEan13(ean13);
      expectTypeOf(ean13).toBeString();
    });
  });
});
