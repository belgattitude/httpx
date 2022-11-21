import { HttpException } from '../../base';
import { HttpBadRequest } from '../../client';
import { HttpInternalServerError } from '../../server';
import { isHttpException } from '../isHttpException';

describe('isHttpException', () => {
  it('should return true if HttpException', () => {
    expect(isHttpException(new HttpException(500))).toBe(true);
  });

  it('should return true if subclass of HttpServerException', () => {
    const error = new HttpInternalServerError();
    expect(isHttpException(error)).toBe(true);
  });

  it('should return true if subclass of HttpClientException', () => {
    expect(isHttpException(new HttpBadRequest())).toBe(true);
  });

  it('should return false if error is not instance of HttpError', () => {
    expect(isHttpException(new Error())).toBe(false);
  });
});
