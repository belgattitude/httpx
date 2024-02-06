import { describe, expect, it } from 'vitest';

import {
  createHttpException,
  HttpClientException,
  HttpException,
  HttpNotFound,
  HttpUnprocessableEntity,
} from '../../src/';
import type { HttpExceptionParamsWithIssues } from '../../src/types/HttpExceptionParamsWithIssues';

describe('Common specs', () => {
  describe('Inheritance', () => {
    it('should properly inform Object.prototype.name', () => {
      const err = new HttpNotFound();
      expect(err.name).toStrictEqual('HttpNotFound');
    });
    it('should properly get the default message', () => {
      const err = new HttpNotFound();
      expect(err.message).toStrictEqual('Not found');
    });
    it('should be properly respect inheritance', () => {
      const err = new HttpNotFound();
      expect(err.name).toStrictEqual('HttpNotFound');
      expect(err).toBeInstanceOf(HttpNotFound);
      expect(err).toBeInstanceOf(HttpException);
      expect(err).toBeInstanceOf(HttpClientException);
    });
  });

  describe('createHttpException', () => {
    it('should support HttpUnprocessableEntity with issues', () => {
      const e422Params: HttpExceptionParamsWithIssues = {
        issues: [
          {
            code: 'empty_string',
            message: 'Invalid address',
            path: ['addresses', 0, 'line1'],
          },
        ],
        message: 'Validation failed',
      };
      expect(createHttpException(422, e422Params)).toStrictEqual(
        new HttpUnprocessableEntity(e422Params)
      );
    });
  });
});
