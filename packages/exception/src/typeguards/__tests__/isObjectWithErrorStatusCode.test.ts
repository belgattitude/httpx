import { describe, expect, it } from 'vitest';

import { HttpNotFound } from '../../client';
import { isObjectWithErrorStatusCode } from '../isObjectWithErrorStatusCode';

describe('isObjectWithErrorStatusCode', () => {
  it.each([
    [false, 100],
    [false, {}],
    [false, Number.NaN],
    [true, { statusCode: 400 }],
    [false, new Error()],
    [
      true,
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
    expect(isObjectWithErrorStatusCode(value)).toBe(expected);
  });
});
