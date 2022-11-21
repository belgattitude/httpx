import { HttpBadRequest } from '../../client';
import { HttpInternalServerError } from '../../server';
import { isHttpServerException } from '../isHttpServerException';

describe('isHttpServerException', () => {
  it('should return false if not a subclass of HttpServerException', () => {
    expect(isHttpServerException(new HttpBadRequest())).toBe(false);
  });

  it('should return true if subclass of HttpServerException', () => {
    expect(isHttpServerException(new HttpInternalServerError())).toBe(true);
  });

  it('should return false if error is not instance of HttpServerException', () => {
    expect(isHttpServerException(new Error())).toBe(false);
  });
});
