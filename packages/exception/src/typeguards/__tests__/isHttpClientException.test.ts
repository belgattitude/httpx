import { HttpBadRequest } from '../../client';
import { HttpInternalServerError } from '../../server';
import { isHttpClientException } from '../isHttpClientException';

describe('isHttpClientException', () => {
  it('should return false if not a subclass of HttpClientException', () => {
    const error = new HttpInternalServerError();
    expect(isHttpClientException(error)).toBe(false);
  });

  it('should return true if subclass of HttpClientException', () => {
    expect(isHttpClientException(new HttpBadRequest())).toBe(true);
  });

  it('should return false if error is not instance of HttpError', () => {
    expect(isHttpClientException(new Error())).toBe(false);
  });
});
