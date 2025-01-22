import { describe, expect, it } from 'vitest';

import { isHttpErrorStatusCode } from '../isHttpErrorStatusCode';

describe('isHttpErrorStatusCode', () => {
  it('should return true if status code is an http error status', () => {
    expect(isHttpErrorStatusCode(400)).toBe(true);
    expect(isHttpErrorStatusCode(599)).toBe(true);
  });

  it('should return false if status code not an error', () => {
    expect(isHttpErrorStatusCode(200)).toBe(false);
    expect(isHttpErrorStatusCode(399)).toBe(false);
    expect(isHttpErrorStatusCode(600)).toBe(false);
  });

  it('should return false if status is not a number', () => {
    expect(isHttpErrorStatusCode(new Date())).toBe(false);
    expect(isHttpErrorStatusCode(Number.NaN)).toBe(false);
    expect(isHttpErrorStatusCode('100')).toBe(false);
  });
});
