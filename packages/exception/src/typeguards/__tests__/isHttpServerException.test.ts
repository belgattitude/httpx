import { describe, expect, it } from 'vitest';

import { HttpServerException } from '../../base';
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

  describe('when statusCode checks are disabled', () => {
    it('should be true even if the statusCode is not indicating a server error (5xx)', () => {
      expect(
        isHttpServerException(
          new (class extends HttpServerException {
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
    it('should be false if the statusCode is not indicating a server error (5xx)', () => {
      expect(
        isHttpServerException(
          new (class extends HttpServerException {
            constructor() {
              super(400);
            }
          })(),
          true
        )
      ).toBe(false);
    });
  });
});
