import { describe, expect, it } from "vitest";

import {
  HttpClientException,
  HttpException,
  HttpNotFound,
  HttpServerException,
  isHttpClientException,
  isHttpException,
  isHttpServerException,
} from "../../src";
import {
  convertToSerializable,
  createFromSerializable,
  fromJson,
  SerializerError,
  toJson,
} from "../../src/serializer";
import type { Serializable } from "../../src/serializer/types";

const countCauses = (e: unknown): number => {
  let count = 0;
  let current = (e as Error).cause;
  while (current instanceof Error) {
    count++;
    current = current.cause;
  }
  return count;
};

describe("Serializer hardening", () => {
  describe("fromJson never throws", () => {
    it.each([
      ["null", "null"],
      ["a number", "42"],
      ["a string", '"error"'],
      ["an array", "[]"],
      ["an unknown __type", '{"__type":"Unknown","name":"Error"}'],
      [
        "an invalid cause",
        '{"__type":"NativeError","name":"Error","message":"m","cause":"x"}',
      ],
    ])("should return a SerializerError when json is %s", (_label, json) => {
      const e = fromJson(json);
      expect(e).toBeInstanceOf(SerializerError);
      expect(e.message).toMatch(/^Can't unserialize/);
    });

    it("should still return a SerializerError for invalid json", () => {
      expect(fromJson("{")).toBeInstanceOf(SerializerError);
    });
  });

  describe("createFromSerializable", () => {
    it("should throw a SerializerError on invalid payloads", () => {
      expect(() =>
        createFromSerializable(null as unknown as Serializable)
      ).toThrow(SerializerError);
    });

    it.each(["constructor", "toString", "__proto__", "hasOwnProperty"])(
      "should fallback to Error when name is the inherited key '%s'",
      (name) => {
        const e = createFromSerializable({
          __type: "NativeError",
          message: "m",
          name,
        });
        expect(e).toBeInstanceOf(Error);
        expect(e.constructor).toBe(Error);
        expect(e.message).toBe("m");
      }
    );

    it("should keep native error classes", () => {
      const e = createFromSerializable({
        __type: "NativeError",
        message: "m",
        name: "TypeError",
      });
      expect(e).toBeInstanceOf(TypeError);
    });
  });

  describe("nested causes depth", () => {
    const createDeepPayload = (depth: number) => {
      let payload: Serializable = {
        __type: "NativeError",
        message: "leaf",
        name: "Error",
      };
      for (let i = 0; i < depth; i++) {
        payload = {
          __type: i % 2 === 0 ? "HttpException" : "NativeError",
          cause: payload,
          message: `level ${i}`,
          name: i % 2 === 0 ? "HttpNotFound" : "Error",
          statusCode: 404,
        };
      }
      return payload;
    };

    it("should keep up to 10 nested causes", () => {
      const e = createFromSerializable(createDeepPayload(10));
      expect(countCauses(e)).toBe(10);
    });

    it("should drop causes deeper than 10 levels", () => {
      const e = createFromSerializable(createDeepPayload(15));
      expect(countCauses(e)).toBe(10);
    });

    it("should not overflow the stack on deeply nested json", () => {
      const e = fromJson(JSON.stringify(createDeepPayload(20_001)));
      expect(e).toBeInstanceOf(HttpNotFound);
      expect(countCauses(e)).toBe(10);
    });

    it("should not overflow the stack when serializing cyclic causes", () => {
      const a = new HttpNotFound();
      const b = new Error("b", { cause: a });
      Object.defineProperty(a, "cause", { value: b });
      const serializable = convertToSerializable(a);
      expect(countCauses(createFromSerializable(serializable))).toBe(10);
      expect(() => toJson(a)).not.toThrow();
    });
  });

  describe("typeguards require a numeric statusCode", () => {
    it("should reject an exception with a string statusCode", () => {
      const e = fromJson(
        '{"__type":"HttpException","name":"HttpNotFound","message":"m","statusCode":"404"}'
      );
      expect(e).toBeInstanceOf(HttpException);
      expect(isHttpException(e)).toBe(false);
      expect(isHttpException(e, false)).toBe(false);
    });

    it.each([
      ["HttpException", new HttpException("404" as unknown as number)],
      [
        "HttpClientException",
        new HttpClientException("404" as unknown as number),
      ],
      [
        "HttpServerException",
        new HttpServerException("500" as unknown as number),
      ],
    ])("should reject a %s built with a string statusCode", (_name, e) => {
      expect(isHttpException(e)).toBe(false);
      expect(isHttpException(e, false)).toBe(false);
      expect(isHttpClientException(e, false)).toBe(false);
      expect(isHttpServerException(e, false)).toBe(false);
    });
  });
});
