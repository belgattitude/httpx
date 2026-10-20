import { describe, expect, it, vi } from "vitest";

import {
  HttpClientException,
  HttpException,
  HttpNotFound,
  HttpRequestTimeout,
  HttpServerException,
  isHttpClientException,
  isHttpException,
  isHttpServerException,
} from "../../src";
import { convertToSerializable } from "../../src/serializer";

// not available in browsers and cloudflare workerd
const runInNewContext = await import("node:vm")
  .then((mod) => mod.runInNewContext)
  .catch(() => undefined);

/**
 * Load another copy of the package (ie: esm + cjs builds, or 2 installs of the same major)
 */
const importOtherCopy = async () => {
  vi.resetModules();
  return await import("../../src");
};

describe("Cross-realm specs", () => {
  describe.skipIf(typeof runInNewContext !== "function")(
    "node:vm runInNewContext",
    () => {
      it("should support instanceof when created in a new context", () => {
        const sandbox = { HttpNotFound, err: null as unknown };
        runInNewContext!(
          `err = new HttpNotFound({ message: "From vm", url: "http://localhost" })`,
          sandbox
        );
        const { err } = sandbox;
        expect(err).toBeInstanceOf(HttpNotFound);
        expect(err).toBeInstanceOf(HttpClientException);
        expect(err).toBeInstanceOf(HttpException);
        expect(err).toBeInstanceOf(Error);
        expect(err).not.toBeInstanceOf(HttpServerException);
        expect(isHttpException(err)).toBe(true);
        expect(isHttpClientException(err)).toBe(true);
        expect(err).toMatchObject({
          name: "HttpNotFound",
          message: "From vm",
          statusCode: 404,
          url: "http://localhost",
        });
      });

      it("should support instanceof when thrown from a new context", () => {
        let caught: unknown;
        try {
          runInNewContext!(`throw new HttpNotFound()`, { HttpNotFound });
        } catch (error) {
          caught = error;
        }
        expect(caught).toBeInstanceOf(HttpNotFound);
        expect(caught).toBeInstanceOf(HttpException);
        expect(caught).toBeInstanceOf(Error);
        expect(isHttpException(caught)).toBe(true);
      });

      it("should support a cause created with the new context Error", () => {
        const sandbox = { HttpNotFound, err: null as unknown };
        runInNewContext!(
          `err = new HttpNotFound({ cause: new Error("vm cause") })`,
          sandbox
        );
        const err = sandbox.err as HttpNotFound;
        expect(err).toBeInstanceOf(HttpNotFound);
        // The vm Error comes from another realm: it is not an instanceof
        // the current realm Error, so the cause is dropped.
        expect(err.cause).toBeUndefined();
      });
    }
  );

  describe("Multiple copies of the same major version", () => {
    it("should load a distinct copy", async () => {
      const other = await importOtherCopy();
      expect(other.HttpNotFound).not.toBe(HttpNotFound);
      expect(other.HttpException).not.toBe(HttpException);
    });

    it("should support instanceof and typeguards across copies", async () => {
      const other = await importOtherCopy();
      const err = new other.HttpNotFound({ url: "http://localhost" });
      expect(err).toBeInstanceOf(HttpNotFound);
      expect(err).toBeInstanceOf(HttpClientException);
      expect(err).toBeInstanceOf(HttpException);
      expect(err).toBeInstanceOf(Error);
      expect(err).not.toBeInstanceOf(HttpServerException);
      expect(err).not.toBeInstanceOf(HttpRequestTimeout);
      expect(isHttpException(err)).toBe(true);
      expect(isHttpClientException(err)).toBe(true);
      expect(isHttpServerException(err)).toBe(false);

      // the other way around
      const local = new HttpNotFound();
      expect(local).toBeInstanceOf(other.HttpNotFound);
      expect(other.isHttpException(local)).toBe(true);
    });

    it("should not match a base exception against a more specific class", async () => {
      const other = await importOtherCopy();
      const err = new other.HttpClientException(404);
      expect(err).toBeInstanceOf(HttpClientException);
      expect(err).toBeInstanceOf(HttpException);
      expect(err).not.toBeInstanceOf(HttpNotFound);
    });

    it("should serialize exceptions from another copy", async () => {
      const other = await importOtherCopy();
      const err = new other.HttpNotFound({ url: "http://localhost" });
      expect(convertToSerializable(err)).toStrictEqual({
        __type: "HttpException",
        message: "Not found",
        name: "HttpNotFound",
        statusCode: 404,
        url: "http://localhost",
      });
    });

    it("should not leak the brand in enumerable properties", () => {
      const err = new HttpNotFound();
      const symbols = Object.getOwnPropertySymbols(err);
      expect(symbols).toHaveLength(1);
      expect(
        Object.getOwnPropertyDescriptor(err, symbols[0]!)?.enumerable
      ).toBe(false);
      expect(JSON.stringify(err)).not.toContain("httpx");
    });

    it.each([HttpException, HttpClientException, HttpNotFound])(
      "should not leak the brand in %o enumerable statics",
      (cls) => {
        expect(Object.keys(cls).some((key) => key.startsWith("@httpx"))).toBe(
          false
        );
        const keys: string[] = [];
        // oxlint-disable-next-line guard-for-in -- inherited statics on purpose
        for (const key in cls) {
          keys.push(key);
        }
        expect(keys.some((key) => key.startsWith("@httpx"))).toBe(false);
      }
    );

    it("should brand instances with the names of their class hierarchy", () => {
      const brandKey = Object.getOwnPropertySymbols(new HttpNotFound())[0]!;
      expect(
        (new HttpNotFound() as unknown as Record<symbol, unknown>)[brandKey]
      ).toStrictEqual(["HttpException", "HttpClientException", "HttpNotFound"]);
      class UserException extends HttpNotFound {}
      expect(
        (new UserException() as unknown as Record<symbol, unknown>)[brandKey]
      ).toStrictEqual(["HttpException", "HttpClientException", "HttpNotFound"]);
    });
  });

  describe("Different major versions", () => {
    it("should not match exceptions branded with another major version", () => {
      const brandKey = Object.getOwnPropertySymbols(new HttpNotFound())[0]!;
      expect(Symbol.keyFor(brandKey)).toMatch(/^@httpx\/exception-v\d+$/);
      const fromOtherMajor = Object.defineProperty(
        Object.assign(new Error("Not found"), { statusCode: 404 }),
        Symbol.for("@httpx/exception-v999999"),
        { value: ["HttpException", "HttpClientException", "HttpNotFound"] }
      );
      expect(fromOtherMajor).not.toBeInstanceOf(HttpNotFound);
      expect(fromOtherMajor).not.toBeInstanceOf(HttpException);
      expect(isHttpException(fromOtherMajor)).toBe(false);
    });
  });

  describe("Brand hardening", () => {
    const brandKey = Object.getOwnPropertySymbols(new HttpNotFound())[0]!;
    const brands = ["HttpException", "HttpClientException", "HttpNotFound"];
    const withBrand = <T extends object>(obj: T) =>
      Object.defineProperty(obj, brandKey, { value: brands });

    it("should match a branded error with a numeric statusCode", () => {
      const branded = withBrand(
        Object.assign(new Error("Not found"), { statusCode: 404 })
      );
      expect(branded).toBeInstanceOf(HttpNotFound);
    });

    it("should not match a branded plain object", () => {
      const branded = withBrand({ message: "Not found", statusCode: 404 });
      expect(branded).not.toBeInstanceOf(HttpNotFound);
      expect(branded).not.toBeInstanceOf(HttpException);
      expect(isHttpException(branded)).toBe(false);
    });

    it.each([undefined, "404", null])(
      "should not match a branded error with statusCode %s",
      (statusCode) => {
        const branded = withBrand(
          Object.assign(new Error("Not found"), { statusCode })
        );
        expect(branded).not.toBeInstanceOf(HttpNotFound);
        expect(branded).not.toBeInstanceOf(HttpException);
      }
    );

    it("should not match a branded error with a non-array brand", () => {
      const branded = Object.defineProperty(
        Object.assign(new Error("Not found"), { statusCode: 404 }),
        brandKey,
        { value: "HttpNotFound" }
      );
      expect(branded).not.toBeInstanceOf(HttpNotFound);
    });
  });
});
