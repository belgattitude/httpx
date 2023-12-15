import { describe, expect, it } from 'vitest';

import { HttpException } from '../HttpException';
import { HttpServerException } from '../HttpServerException';

describe('HttpServerException', () => {
  it('should be instance of HttpException', () => {
    const exception = new HttpServerException(599);
    expect(exception).toBeInstanceOf(HttpException);
  });
  it('should default message to "Http client exception"', () => {
    const exception = new HttpServerException(599);
    expect(exception.message).toStrictEqual('Http server exception');
  });
  it('should have native error properties', () => {
    const exception = new HttpServerException(599, { message: 'test' });
    expect(exception.name).toStrictEqual('HttpServerException');
    expect(exception.message).toStrictEqual('test');
    expect(exception.stack).toStrictEqual(expect.any(String));
    expect(exception.cause).toBeUndefined();
  });
  it('should persist url and statusCode', () => {
    const exception = new HttpServerException(599, {
      message: 'test',
      url: 'https://localhost',
    });
    expect(exception.url).toStrictEqual('https://localhost');
    expect(exception.statusCode).toStrictEqual(599);
  });
  it('should support sending a cause as Error', () => {
    let exception: HttpServerException;
    const errorCause = new Error('Origin error');
    try {
      throw errorCause;
    } catch (cause) {
      exception = new HttpServerException(500, {
        cause: cause as Error,
      });
    }
    expect(exception.cause).toStrictEqual(errorCause);
    expect((exception.cause as unknown as Error).message).toStrictEqual(
      'Origin error'
    );
  });
});
