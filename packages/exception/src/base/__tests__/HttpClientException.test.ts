import { HttpClientException } from '../HttpClientException';
import { HttpException } from '../HttpException';

describe('HttpClientException', () => {
  it('should be instance of HttpException', () => {
    const exception = new HttpClientException(499);
    expect(exception).toBeInstanceOf(HttpException);
  });
  it('should default message to "Http client exception"', () => {
    const exception = new HttpClientException(499);
    expect(exception.message).toStrictEqual('Http client exception');
  });
  it('should have native error properties', () => {
    const exception = new HttpClientException(499, { message: 'test' });
    expect(exception.name).toStrictEqual('HttpClientException');
    expect(exception.message).toStrictEqual('test');
    expect(exception.stack).toStrictEqual(expect.any(String));
    expect(exception.cause).toBeUndefined();
  });
  it('should persist url and statusCode', () => {
    const exception = new HttpClientException(499, {
      message: 'test',
      url: 'https://localhost',
    });
    expect(exception.url).toStrictEqual('https://localhost');
    expect(exception.statusCode).toStrictEqual(499);
  });
  it('should support sending a cause', () => {
    let exception: HttpClientException;
    const errorCause = new Error('Origin error');
    try {
      throw errorCause;
    } catch (cause) {
      exception = new HttpClientException(500, {
        cause: cause as unknown as Error,
      });
    }
    expect(exception.cause).toStrictEqual(errorCause);
    expect((exception.cause as unknown as Error).message).toStrictEqual(
      'Origin error'
    );
  });
});
