import { assertHttpMethod, assertHttpValidMethod } from '../http.asserts';

describe('http assertions tests', () => {
  describe('assertHttpValidMethod', () => {
    it('should not throw when given value is a valid http method', () => {
      expect(() => assertHttpValidMethod('get')).not.toThrow();
      expect(() => assertHttpValidMethod('GET')).not.toThrow();
    });
    it('should throw when not a valid http method', () => {
      expect(() => assertHttpValidMethod('glue')).toThrow(
        new TypeError(
          'Value is expected to be an http method, got: string(length:4)'
        )
      );
    });
    it('should throw custom error when value is invalid', () => {
      const e = new Error('cool');
      expect(() => assertHttpValidMethod([], () => e)).toThrow(e);
    });
  });
  describe('assertHttpMethod', () => {
    it('should not throw when given value is a valid http method', () => {
      expect(() => assertHttpMethod('GET', 'get')).not.toThrow();
      expect(() => assertHttpMethod('POST', 'POST')).not.toThrow();
    });
    it('should throw when not a valid http method', () => {
      expect(() => assertHttpMethod('GET', 'glue')).toThrow(
        new TypeError(
          "Value is expected to be an http 'GET' method, got: string(length:4)"
        )
      );
    });
    it('should throw custom error when value is invalid', () => {
      const e = new Error('cool');
      expect(() => assertHttpMethod('GET', [], () => e)).toThrow(e);
    });
  });
});
