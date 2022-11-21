import { isHttpErrorStatusCode } from '../isHttpErrorStatusCode';

describe('isHttpErrorStatusCode', () => {
  it('should return true if status code is an http error status', () => {
    expect(isHttpErrorStatusCode(400)).toBeTruthy();
    expect(isHttpErrorStatusCode(599)).toBeTruthy();
  });

  it('should return false if status code not an error', () => {
    expect(isHttpErrorStatusCode(200)).toBeFalsy();
    expect(isHttpErrorStatusCode(399)).toBeFalsy();
    expect(isHttpErrorStatusCode(600)).toBeFalsy();
  });

  it('should return false if status is not a number', () => {
    expect(isHttpErrorStatusCode(new Date())).toBeFalsy();
    expect(isHttpErrorStatusCode(Number.NaN)).toBeFalsy();
    expect(isHttpErrorStatusCode('100')).toBeFalsy();
  });
});
