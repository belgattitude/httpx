import { isParsableDsn } from '../is-parsable-dsn';

describe('isParsableDsn', () => {
  it.each([
    'redis://localhost',
    'mysql://localhost',
    'postgresql://localhost:35045',
  ])('should assert valid dsn', (dsn) => {
    expect(isParsableDsn(dsn)).toStrictEqual(true);
  });
  it("should throw when dsn can't be parsed", () => {
    expect(isParsableDsn('redis:/')).toStrictEqual(false);
  });
});
