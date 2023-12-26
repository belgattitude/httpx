import { describe, expect, it } from 'vitest';

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
  describe('when statusCode checks are disabled', () => {
    it('should be true even if the statusCode is not indicating a status error (4xx/5xx)', () => {
      expect(
        isHttpException(
          new (class extends HttpException {
            constructor() {
              super(300);
            }
          })(),
          false
        )
      ).toBe(true);
    });
  });

  describe('when statusCode checks are enabled', () => {
    it('should be false if the statusCode is not indicating a status error (4xx/5xx)', () => {
      expect(
        isHttpException(
          new (class extends HttpException {
            constructor() {
              super(300);
            }
          })(),
          true
        )
      ).toBe(false);
    });
  });
});
