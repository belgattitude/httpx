import { describe, expect, it } from 'vitest';

import { isHttpStatusCode } from '../isHttpStatusCode';

describe('isHttpStatusCode', () => {
  it('should return true if status code is valid', () => {
    expect(isHttpStatusCode(100)).toBe(true);
    expect(isHttpStatusCode(599)).toBe(true);
  });

  it('should return false if status code is out of range', () => {
    expect(isHttpStatusCode(99)).toBe(false);
    expect(isHttpStatusCode(600)).toBe(false);
  });

  it('should return false if status is not a number', () => {
    expect(isHttpStatusCode(new Date())).toBe(false);
    expect(isHttpStatusCode(Number.NaN)).toBe(false);
    expect(isHttpStatusCode('100')).toBe(false);
  });
});
