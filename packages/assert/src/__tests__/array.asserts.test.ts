import { assertArrayNotEmpty } from '../array.asserts';

describe('array assertions tests', () => {
  it('should not throw when given value is non empty array', () => {
    expect(() => assertArrayNotEmpty([''])).not.toThrow();
  });
  it('should throw when array is empty', () => {
    expect(() => assertArrayNotEmpty([])).toThrow(
      new TypeError(
        'Value is expected to be a non-empty array, got: array(size:0)'
      )
    );
  });
  it('should throw when value is not an array', () => {
    expect(() => assertArrayNotEmpty('cool')).toThrow(
      new TypeError(
        'Value is expected to be a non-empty array, got: string(length:4)'
      )
    );
  });

  it('should throw custom error when value is invalid', () => {
    const e = new Error('cool');
    expect(() => assertArrayNotEmpty([], () => e)).toThrow(e);
  });
});
