import { describe, expect, it } from "vitest";

import { HttpClientException } from "../HttpClientException";
import { HttpException } from "../HttpException";

describe("HttpClientException", () => {
  it("should be instance of HttpException", () => {
    const exception = new HttpClientException(499);
    expect(exception).toBeInstanceOf(HttpException);
  });

  it('should default message to "Http client exception"', () => {
    const exception = new HttpClientException(499);
    expect(exception.message).toBe("Http client exception");
  });

  it("should have native error properties", () => {
    const exception = new HttpClientException(499, { message: "test" });
    expect(exception.name).toBe("HttpClientException");
    expect(exception.message).toBe("test");
    expect(exception.stack).toStrictEqual(expect.any(String));
    expect(exception.cause).toBeUndefined();
  });

  it("should persist url and statusCode", () => {
    const exception = new HttpClientException(499, {
      message: "test",
      url: "https://localhost",
    });
    expect(exception.url).toBe("https://localhost");
    expect(exception.statusCode).toBe(499);
  });

  it("should support sending a cause", () => {
    let exception: HttpClientException;
    const errorCause = new Error("Origin error");
    try {
      throw errorCause;
    } catch (error) {
      exception = new HttpClientException(500, {
        cause: error as Error,
      });
    }
    expect(exception.cause).toStrictEqual(errorCause);
    expect((exception.cause as unknown as Error).message).toBe("Origin error");
  });
});
