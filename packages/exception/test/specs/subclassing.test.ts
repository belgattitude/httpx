import { describe, expect, it } from "vitest";

import {
  HttpClientException,
  HttpException,
  HttpNotFound,
  HttpServerException,
} from "../../src";

describe("Subclassing exceptions in userland", () => {
  it.each([
    ["HttpException", HttpException, [500]],
    ["HttpClientException", HttpClientException, [400]],
    ["HttpServerException", HttpServerException, [500]],
    ["HttpNotFound", HttpNotFound, []],
  ] as const)(
    "should keep the subclass prototype when extending %s",
    (_name, Base, args) => {
      // oxlint-disable-next-line typescript/no-explicit-any
      const Ctor = Base as new (...args: any[]) => HttpException;
      class MyException extends Ctor {
        getHint() {
          return `hint for ${this.statusCode}`;
        }
      }
      const e = new MyException(...args);

      expect(e).toBeInstanceOf(Base);
      expect(Object.getPrototypeOf(e)).toBe(MyException.prototype);
      expect(e).toBeInstanceOf(MyException);
      expect(e.getHint()).toBe(`hint for ${e.statusCode}`);
    }
  );
});
