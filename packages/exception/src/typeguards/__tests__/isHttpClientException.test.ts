import { describe, expect, it } from 'vitest';

import { HttpClientException } from '../../base';
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

  describe('when statusCode checks are disabled (by default)', () => {
    it('should be true even if the statusCode is not indicating a client error (4xx)', () => {
      expect(
        isHttpClientException(
          new (class extends HttpClientException {
            constructor() {
              super(500);
            }
          })(),
          false
        )
      ).toBe(true);
    });
  });

  describe('when statusCode checks are enabled', () => {
    it('should be false if the statusCode is not indicating a client error (4xx)', () => {
      expect(
        isHttpClientException(
          new (class extends HttpClientException {
            constructor() {
              super(500);
            }
          })(),
          true
        )
      ).toBe(false);
    });
  });
});
