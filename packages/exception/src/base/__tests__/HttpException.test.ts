import type { HttpExceptionParams } from '../../types/HttpExceptionParams';
import { HttpException } from '../HttpException';

describe('HttpException', () => {
  it('should be instance of Error', () => {
    const exception = new HttpException(500);
    expect(exception).toBeInstanceOf(HttpException);
  });
  it('should default message to "Http exception"', () => {
    const exception = new HttpException(500);
    expect(exception.message).toStrictEqual('Http exception');
  });
  it('should have native error properties', () => {
    const exception = new HttpException(500, { message: 'test' });
    expect(exception.name).toStrictEqual('HttpException');
    expect(exception.message).toStrictEqual('test');
    expect(exception.stack).toStrictEqual(expect.any(String));
    expect(exception.cause).toBeUndefined();
  });
  it('should persist statusCode and params', () => {
    const params: HttpExceptionParams = {
      errorId: 'nanoid()',
      message: 'msg',
      code: 'NETWORK_UNAVAILABLE',
      url: 'http://localhost',
      method: 'PUT',
    };
    const exception = new HttpException(500, params);
    expect(exception.url).toStrictEqual(params.url);
    expect(exception.errorId).toStrictEqual(params.errorId);
    expect(exception.message).toStrictEqual(params.message);
    expect(exception.code).toStrictEqual(params.code);
    expect(exception.method).toStrictEqual(params.method);
    expect(exception.statusCode).toStrictEqual(500);
  });
  it('should support sending a cause', () => {
    let exception: HttpException;
    const errorCause = new Error('Origin error');
    try {
      throw errorCause;
    } catch (cause) {
      exception = new HttpException(500, {
        cause: cause as unknown as Error,
      });
    }
    expect(exception.cause).toStrictEqual(errorCause);
    expect((exception.cause as unknown as Error).message).toStrictEqual(
      'Origin error'
    );
  });
});
