import { describe, expect, it } from 'vitest';

import { getMsgFromCls } from '../getMsgFromCls';

describe('getMsgFromCls', () => {
  it('should return the exception classname in natural language', () => {
    expect(getMsgFromCls('HttpImATeapot')).toStrictEqual('Im a teapot');
  });
  it('should preserve http prefix for base exceptions', () => {
    expect(getMsgFromCls('HttpException')).toStrictEqual('Http exception');
    expect(getMsgFromCls('HttpClientException')).toStrictEqual(
      'Http client exception'
    );
    expect(getMsgFromCls('HttpServerException')).toStrictEqual(
      'Http server exception'
    );
  });
  it('should preserve http prefix for HttpVersionNotSupported', () => {
    expect(getMsgFromCls('HttpVersionNotSupported')).toStrictEqual(
      'Http version not supported'
    );
  });
});
