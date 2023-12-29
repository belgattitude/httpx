import { eansTestData } from '../../test/test.data';
import { assertEan13 } from '../barcode.asserts';

describe('barcode assertions tests', () => {
  it('should not throw when barcode is valid', () => {
    expect(() => assertEan13(eansTestData.ean13)).not.toThrow();
  });
  it('should throw when barcode is invalid', () => {
    expect(() => assertEan13('12345')).toThrow(
      new TypeError('Value is expected to be an ean13, got: string(5)')
    );
  });
  it('should throw custom error when barcode is invalid', () => {
    const e = new Error('cool');
    expect(() => assertEan13('12345', () => e)).toThrow(e);
  });
});
