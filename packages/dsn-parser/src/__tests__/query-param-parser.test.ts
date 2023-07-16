import { parseQueryParams } from '../query-param-parser';

describe('parseQueryParams', () => {
  it('should parse number, booleans and set true for undefined values', () => {
    const qp = 'kNumeric=1&kTrue=true&kFalse=false&kUndefined&kString=hello';
    expect(
      parseQueryParams(qp, {
        parseNumbers: true,
        parseBooleans: true,
        setTrueForUndefinedValues: true,
      })
    ).toStrictEqual({
      kNumeric: 1,
      kTrue: true,
      kFalse: false,
      kUndefined: true,
      kString: 'hello',
    });
  });

  it('should decode encore uri values', () => {
    expect(
      parseQueryParams(
        'kEncoded=%D1%88%D0%B5%D0%BB%D0%BB%D1%8B&kQuestion=test%3F'
      )
    ).toStrictEqual({
      kEncoded: 'шеллы',
      kQuestion: 'test?',
    });
  });

  it('should set null if setTrueForUndefinedValues is false', () => {
    expect(
      parseQueryParams('kUndefined', {
        setTrueForUndefinedValues: false,
      })
    ).toStrictEqual({
      kUndefined: null,
    });
  });

  it('should left number untouched if parseNumbers is false', () => {
    expect(
      parseQueryParams('kNumeric=1', {
        parseNumbers: false,
      })
    ).toStrictEqual({
      kNumeric: '1',
    });
  });

  it('should left boolean untouched if parseBooleans is false', () => {
    expect(
      parseQueryParams('kTrue=true&kFalse=false', {
        parseBooleans: false,
      })
    ).toStrictEqual({
      kTrue: 'true',
      kFalse: 'false',
    });
  });

  it('should honour default options', () => {
    const qp = 'kNumeric=1&kTrue=true&kFalse=false&kUndefined&kString=hello';
    expect(
      parseQueryParams(qp, {
        parseNumbers: true,
        parseBooleans: true,
        setTrueForUndefinedValues: true,
      })
    ).toStrictEqual(parseQueryParams(qp));
  });
});
