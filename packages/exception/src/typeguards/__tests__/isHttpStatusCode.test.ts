import { isHttpStatusCode } from '../isHttpStatusCode';

describe('isHttpStatusCode', () => {
  it('should return true if status code is valid', () => {
    expect(isHttpStatusCode(100)).toBeTruthy();
    expect(isHttpStatusCode(599)).toBeTruthy();
  });

  it('should return false if status code is out of range', () => {
    expect(isHttpStatusCode(99)).toBeFalsy();
    expect(isHttpStatusCode(600)).toBeFalsy();
  });

  it('should return false if status is not a number', () => {
    expect(isHttpStatusCode(new Date())).toBeFalsy();
    expect(isHttpStatusCode(Number.NaN)).toBeFalsy();
    expect(isHttpStatusCode('100')).toBeFalsy();
  });
});
