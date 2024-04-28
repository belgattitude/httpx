import { assertNetworkPort } from '../network.asserts';

describe('Network assertions tests', () => {
  it('should not throw when given value is a valid http method', () => {
    expect(() => assertNetworkPort(0)).not.toThrow();
    expect(() => assertNetworkPort(65_535)).not.toThrow();
    expect(() => assertNetworkPort(443)).not.toThrow();
  });
  it('should throw when not a valid http method', () => {
    expect(() => assertNetworkPort(1_234_567)).toThrow(
      new TypeError(
        'Value is expected to be a network port, got: number(length:7)'
      )
    );
  });
  it('should throw custom error when value is invalid', () => {
    const e = new Error('cool');
    expect(() => assertNetworkPort([], () => e)).toThrow(e);
  });
});
