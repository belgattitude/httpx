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

    it("should not leak the brand in instances", () => {
      const err = new HttpNotFound();
      expect(Object.getOwnPropertySymbols(err)).toHaveLength(0);
      expect(JSON.stringify(err)).not.toContain("httpx");
    });
  });

  // the brand lives on the classes (statics), instances are matched
  // through the constructors of their prototype chain
  const brandKey = Object.getOwnPropertySymbols(HttpNotFound).find((s) =>
    Symbol.keyFor(s)?.startsWith("@httpx/exception-v")
  )!;

  /**
   * Create an instance of a class carrying a brand (ie: forged by a third-party)
   */
  const createBranded = (
    Base: new (msg?: string) => object,
    props: Record<string, unknown>,
    brand: unknown = "HttpNotFound",
    key: symbol = brandKey
  ) => {
    class Forged extends Base {}
    Object.defineProperty(Forged, key, { value: brand });
    return Object.assign(new Forged("Not found"), props);
  };

  describe("Different major versions", () => {
    it("should not match exceptions branded with another major version", () => {
      expect(Symbol.keyFor(brandKey)).toMatch(/^@httpx\/exception-v\w+$/);
      const fromOtherMajor = createBranded(
        Error,
        { statusCode: 404 },
        "HttpNotFound",
        Symbol.for("@httpx/exception-v999999")
      );
      expect(fromOtherMajor).not.toBeInstanceOf(HttpNotFound);
      expect(fromOtherMajor).not.toBeInstanceOf(HttpException);
      expect(isHttpException(fromOtherMajor)).toBe(false);
    });
  });

  describe("Brand hardening", () => {
    it("should match a branded error with a numeric statusCode", () => {
      const branded = createBranded(Error, { statusCode: 404 });
      expect(branded).toBeInstanceOf(HttpNotFound);
      expect(branded).not.toBeInstanceOf(HttpException);
    });

    it("should not match a branded plain object", () => {
      const branded = createBranded(Object, {
        message: "Not found",
        statusCode: 404,
      });
      expect(branded).not.toBeInstanceOf(HttpNotFound);
      expect(branded).not.toBeInstanceOf(HttpException);
      expect(isHttpException(branded)).toBe(false);
    });

    it.each([undefined, "404", null])(
      "should not match a branded error with statusCode %s",
      (statusCode) => {
        const branded = createBranded(Error, { statusCode });
        expect(branded).not.toBeInstanceOf(HttpNotFound);
        expect(branded).not.toBeInstanceOf(HttpException);
      }
    );

    it("should not match a branded error with a non-string brand", () => {
      const branded = createBranded(Error, { statusCode: 404 }, [
        "HttpNotFound",
      ]);
      expect(branded).not.toBeInstanceOf(HttpNotFound);
    });

    it("should not match a brand only present on the instance", () => {
      const branded = Object.defineProperty(
        Object.assign(new Error("Not found"), { statusCode: 404 }),
        brandKey,
        { value: "HttpNotFound" }
      );
      expect(branded).not.toBeInstanceOf(HttpNotFound);
    });
  });
});
