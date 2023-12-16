import { assertParsableDsn } from '../assert-parsable-dsn';

describe('assertParsableDsn', () => {
  it.each([
    'redis://localhost',
    'mysql://localhost',
    'postgresql://localhost:35045',
  ])('should assert valid dsn', (dsn) => {
    expect(assertParsableDsn(dsn)).toBeUndefined();
  });
  it("should throw when dsn can't be parsed", () => {
    expect(() => assertParsableDsn('redis:/')).toThrow(
      'Cannot parse DSN (PARSE_ERROR)'
    );
  });
  it('should throw custom message', () => {
    expect(() => assertParsableDsn('redis:/', 'message')).toThrow('message');
  });
});
