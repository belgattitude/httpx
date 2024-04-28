import { describe, expect, it } from 'vitest';

import { isHttpMethod, isHttpValidMethod } from '../http.guards';
import type { HttpMethod } from '../http.types';

describe('Http typeguards tests', () => {
  describe('isHttpValidMethod', () => {
    it.each([
      [false, null],
      [false, ''],
      [false, 'GETT'],
      [false, []],
      [false, BigInt(10)],
      [false, new Date()],
      [true, 'GET'],
      [true, 'PUT'],
      [true, 'POST'],
      [true, 'TRACE'],
      [true, 'DELETE'],
      [true, 'HEAD'],
      [true, 'OPTIONS'],
      [true, 'CONNECT'],
      [true, 'get'],
      [true, 'put'],
      [true, 'post'],
      [true, 'trace'],
      [true, 'delete'],
      [true, 'head'],
      [true, 'options'],
      [true, 'connect'],
    ])('should return %s when %s is given', (expected, v) => {
      expect(isHttpValidMethod(v)).toBe(expected);
    });
  });
  describe('isHttpMethod', () => {
    it.each([
      [false, 'GET', 'POST'],
      [false, undefined, 'POST'],
      [true, 'GET', 'GET'],
      [true, 'get', 'GET'],
      [true, 'post', 'POST'],
    ] as [expectation: boolean, v: unknown, method: HttpMethod][])(
      'should return %s when %s is given against %s',
      (expected, v, method) => {
        expect(isHttpMethod(method, v)).toBe(expected);
      }
    );
  });
});
