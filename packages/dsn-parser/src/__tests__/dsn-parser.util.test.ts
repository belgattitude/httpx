import {
  isNonEmptyString,
  isValidNetworkPort,
  mergeDsnOverrides,
  removeUndefined,
} from '../dsn-parser.util';

describe('removeUndefined', () => {
  it('should work as expected', () => {
    expect(removeUndefined({ k: 1, u: undefined })).toStrictEqual({
      k: 1,
    });
  });
});

describe('mergeDsnOverrides', () => {
  it('should replace host and left params intact', () => {
    const testDsn = {
      driver: 'redis',
      host: 'localhost',
      params: {
        k: 1,
      },
    };
    expect(
      mergeDsnOverrides(testDsn, {
        host: 'test.local',
      })
    ).toStrictEqual({
      driver: 'redis',
      host: 'test.local',
      params: {
        k: 1,
      },
    });
  });
});

describe('isValidNetworkPort', () => {
  it('should work as expected', () => {
    expect(isValidNetworkPort(3001)).toBe(true);
    expect(isValidNetworkPort(0)).toBe(false);
    expect(isValidNetworkPort(65_536)).toBe(false);
    expect(isValidNetworkPort(-1)).toBe(false);
  });
});

describe('isNonEmptyString', () => {
  it('should work as expected in when trim === true', () => {
    expect(isNonEmptyString('cool')).toBe(true);
    expect(isNonEmptyString(1)).toBe(false);
    expect(isNonEmptyString('  ')).toBe(false);
    expect(isNonEmptyString('')).toBe(false);
    expect(isNonEmptyString(null)).toBe(false);
    expect(isNonEmptyString({})).toBe(false);
  });
  it('should work as expected in when trim === false', () => {
    expect(isNonEmptyString('cool ', false)).toBe(true);
    expect(isNonEmptyString('  ', false)).toBe(true);
  });
});
