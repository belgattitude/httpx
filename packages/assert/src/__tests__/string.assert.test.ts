import { assertStrNotEmpty } from '../string.asserts';

describe('string assertions tests', () => {
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
