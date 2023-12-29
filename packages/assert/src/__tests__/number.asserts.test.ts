import { assertNumberSafeInt } from '../number.asserts';

describe('number assertions tests', () => {
  it('should not throw when given value is non empty array', () => {
    expect(() => assertNumberSafeInt(Number.MAX_SAFE_INTEGER)).not.toThrow();
    expect(() => assertNumberSafeInt(Number.MIN_SAFE_INTEGER)).not.toThrow();
  });
  it('should throw when not a safeInt', () => {
    expect(() => assertNumberSafeInt(BigInt(10))).toThrow(
      new TypeError(
        'Value is expected to be a safe integer, got: bigint(length:2)'
      )
    );
  });
  it('should throw custom error when value is invalid', () => {
    const e = new Error('cool');
    expect(() => assertNumberSafeInt([], () => e)).toThrow(e);
  });
});
