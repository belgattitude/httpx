import { describe, expect, it } from 'vitest';

import { HttpNotFound } from '../../client';
import { isErrorWithErrorStatusCode } from '../isErrorWithErrorStatusCode';

describe('isErrorWithErrorStatusCode', () => {
  it.each([
    [false, 100],
    [false, {}],
    [false, { statusCode: 400 }],
    [false, new Error()],
    [
      false,
      new (class {
        statusCode = 400;
      })(),
    ],
    [
      false,
      new (class extends Error {
        statusCode = 302;
      })(),
    ],
    [
      true,
      new (class extends Error {
        statusCode = 400;
      })(),
    ],
    [
      true,
      new (class extends Error {
        statusCode = 400;
        otherProp = 'other';
      })(),
    ],
    [true, new HttpNotFound()],
  ])('should return %s when %s', (expected, value) => {
    expect(isErrorWithErrorStatusCode(value)).toBe(expected);
  });
});
