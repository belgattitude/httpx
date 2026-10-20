import { describe, expect, it } from "vitest";

import { HttpClientException } from "../../../base/HttpClientException";
import { HttpException } from "../../../base/HttpException";
import { HttpBadRequest } from "../../../client/HttpBadRequest";
import { HttpUnprocessableEntity } from "../../../client/HttpUnprocessableEntity";
import type { SerializableHttpException } from "../../types";
import { convertToSerializable } from "../convertToSerializable";

describe("convertToSerializable", () => {
  describe("when an http exception is given", () => {
    const httpExceptions: [label: string, error: HttpException][] = [
      ["simple", new HttpException(500)],
      ["withMsg", new HttpException(500, "msg")],
      [
        "withFullParams",
        new HttpException(500, {
          code: "NETWORK_UNAVAILABLE",
          errorId: "nanoid()",
          message: "msg",
          method: "PUT",
          url: "http://localhost",
        }),
      ],
      [
        "withCause",
        new HttpException(500, {
          cause: new HttpException(500, "msg"),
        }),
      ],
      [
        "HttpBadRequest",
        new HttpBadRequest({
          cause: new EvalError(),
          message: "msg",
          url: "http://",
        }),
      ],
    ];

    it.each(httpExceptions)("works with %s", (label, err) => {
      const serializable = convertToSerializable(
        err
      ) as SerializableHttpException;

      expect(serializable.__type).toBe("HttpException");
      expect(serializable.message).toStrictEqual(err.message);
      expect(serializable.name).toStrictEqual(err.name);
      expect(serializable?.url).toStrictEqual(err?.url);
      expect(serializable?.code).toStrictEqual(err?.code);
      expect(serializable?.errorId).toStrictEqual(err?.errorId);
      expect(serializable?.method).toStrictEqual(err?.method);
      const {
        cause: _cause,
        stack: _stack,
        ...serializableWithoutCause
      } = serializable;
      expect(serializableWithoutCause).toMatchSnapshot();
    });
  });

  it("serialize issues of HttpUnprocessableEntity", () => {
    const e422 = new HttpUnprocessableEntity({
      issues: [
        {
          code: "invalid_email",
          message: "Invalid email",
          path: "email",
        },
        {
          code: "empty_string",
          message: "Invalid address",
          path: ["addresses", 0, "line1"],
        },
      ],
      message: "Validation failed",
    });
    const serializable = convertToSerializable(e422);
    expect(
      (serializable as unknown as HttpUnprocessableEntity)?.issues
    ).toStrictEqual(e422?.issues);
  });

  it("serialize empty issues of HttpUnprocessableEntity", () => {
    expect(
      convertToSerializable(new HttpUnprocessableEntity()) as {
        issues?: unknown;
      }
    ).toHaveProperty("issues", []);
  });

  it("serialize issues of an HttpUnprocessableEntity revived without its constructor", () => {
    // ie: superjson registerClass, class-transformer...
    const issues = [{ message: "Invalid email", path: "email" }];
    const revived = Object.assign(
      Object.create(
        HttpUnprocessableEntity.prototype
      ) as HttpUnprocessableEntity,
      { message: "Unprocessable entity", statusCode: 422, issues }
    );
    expect(revived).toBeInstanceOf(HttpUnprocessableEntity);
    expect(convertToSerializable(revived)).toHaveProperty("issues", issues);
  });

  it("serialize issues of an HttpUnprocessableEntity subclass", () => {
    class ValidationException extends HttpUnprocessableEntity {}
    const issues = [{ message: "Invalid email", path: "email" }];
    expect(
      convertToSerializable(new ValidationException({ issues }))
    ).toHaveProperty("issues", issues);
  });

  it.each([
    ["HttpClientException(422)", new HttpClientException(422)],
    [
      "a 422 HttpClientException with issues",
      Object.assign(new HttpClientException(422), { issues: [] }),
    ],
    [
      "a non 422 exception with issues",
      Object.assign(new HttpClientException(400), { issues: [] }),
    ],
  ])("should not serialize issues of %s", (_label, e) => {
    expect(convertToSerializable(e)).not.toHaveProperty("issues");
  });

  describe("when native error is given", () => {
    const natives: [label: string, err: Error][] = [
      ["ErrorSimple", new Error()],
      ["ErrorSimpleRange", new RangeError()],
      ["ErrorSimpleEval", new EvalError()],
      ["ErrorMsg", new Error("msg")],
      [
        "ErrorMsg",
        new Error("msg", {
          cause: new Error("msg"),
        }),
      ],
    ];

    it.each(natives)("works with %s", (label, err) => {
      const serializable = convertToSerializable(err);
      expect(serializable.__type).toBe("NativeError");
      expect(serializable.message).toStrictEqual(err.message);
      expect(serializable.name).toStrictEqual(err.name);
      const {
        cause: _cause,
        stack: _stack,
        ...serializableWithoutCause
      } = serializable;
      expect(serializableWithoutCause).toMatchSnapshot();
    });
  });

  describe("when non native error is given", () => {
    class NonNativeError extends Error {
      constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, NonNativeError.prototype);
        this.name = "NonNativeError";
      }
    }

    it("set the type to NonNativeError", () => {
      const e = new NonNativeError("msg");
      const serializable = convertToSerializable(e);
      expect(e.name).toBe("NonNativeError");
      expect(serializable.__type).toBe("NonNativeError");
      const {
        cause: _cause,
        stack: _stack,
        ...serializableWithoutCause
      } = serializable;
      expect(serializableWithoutCause).toMatchSnapshot();
    });
  });

  describe("when a non error is given", () => {
    it("switch to build-in Error with custom message", () => {
      const e = new Date() as unknown as Error;
      const serializable = convertToSerializable(e);
      expect(serializable.__type).toBe("NonNativeError");
      const {
        cause: _cause,
        stack: _stack,
        ...serializableWithoutCause
      } = serializable;
      expect(serializableWithoutCause).toMatchSnapshot();
    });
  });

  describe("when includeStack is set", () => {
    const eachCases = [
      [
        "http-exception-default-include-stack",
        undefined,
        false,
        new HttpException(500),
      ],
      [
        "http-exception-with-include-stack=true",
        true,
        true,
        new HttpException(500),
      ],
      [
        "http-exception-with-include-stack=false",
        false,
        false,
        new HttpException(500),
      ],
      [
        "native-error-default-include-stack",
        undefined,
        false,
        new Error("test"),
      ],
      ["native-error-with-include-stack=true", true, true, new Error("test")],
      [
        "native-error-with-include-stack=false",
        false,
        false,
        new Error("test"),
      ],
    ] as const satisfies [
      label: string,
      includeStack: boolean | undefined,
      hasStack: boolean,
      error: HttpException | Error,
    ][];

    it.each(eachCases)(
      'for "%s" with includeStack="%s", should return stack="%s"',
      (_label, includeStack, hasStack, error) => {
        const serializable = convertToSerializable(error, {
          includeStack,
        });
        const { stack } = serializable;
        expect(stack === undefined).toBe(!hasStack);
      }
    );
  });
});
