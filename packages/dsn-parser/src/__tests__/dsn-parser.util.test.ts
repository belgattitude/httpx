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
    expect(isValidNetworkPort(3001)).toBeTruthy();
    expect(isValidNetworkPort(0)).toBeFalsy();
    expect(isValidNetworkPort(65_536)).toBeFalsy();
    expect(isValidNetworkPort(-1)).toBeFalsy();
  });
});

describe('isNonEmptyString', () => {
  it('should work as expected in when trim === true', () => {
    expect(isNonEmptyString('cool')).toBeTruthy();
    expect(isNonEmptyString(1)).toBeFalsy();
    expect(isNonEmptyString('  ')).toBeFalsy();
    expect(isNonEmptyString('')).toBeFalsy();
    expect(isNonEmptyString(null)).toBeFalsy();
    expect(isNonEmptyString({})).toBeFalsy();
  });
  it('should work as expected in when trim === false', () => {
    expect(isNonEmptyString('cool ', false)).toBeTruthy();
    expect(isNonEmptyString('  ', false)).toBeTruthy();
  });
});
