import { describe, expect, it } from "vitest";

import pkg from "../../../package.json" with { type: "json" };
import { HttpClientException } from "../../base/HttpClientException";
import { HttpNotFound } from "../../client/HttpNotFound";
import { HttpUnprocessableEntity } from "../../client/HttpUnprocessableEntity";
import { brandKey, isBrandedAs } from "../brand";

describe("brandKey", () => {
  it("should follow the package major version", () => {
    const [major] = pkg.version.split(".");
    expect(Symbol.keyFor(brandKey)).toBe(`@httpx/exception-v${major}`);
  });
});

describe("isBrandedAs", () => {
  it("should match the class hierarchy of a constructed instance", () => {
    const e = new HttpUnprocessableEntity();
    expect(isBrandedAs(e, "HttpUnprocessableEntity")).toBe(true);
    expect(isBrandedAs(e, "HttpClientException")).toBe(true);
    expect(isBrandedAs(e, "HttpNotFound")).toBe(false);
  });

  it("should match instances of user subclasses", () => {
    class ValidationException extends HttpUnprocessableEntity {}
    expect(
      isBrandedAs(new ValidationException(), "HttpUnprocessableEntity")
    ).toBe(true);
  });

  it("should match instances created without their constructor", () => {
    class ValidationException extends HttpUnprocessableEntity {}
    const revived = Object.create(ValidationException.prototype) as object;
    expect(isBrandedAs(revived, "HttpUnprocessableEntity")).toBe(true);
    expect(isBrandedAs(revived, "HttpNotFound")).toBe(false);
  });

  it("should trust the instance brand over the prototype chain", () => {
    // ie: an HttpClientException(422) is never an HttpUnprocessableEntity
    expect(
      isBrandedAs(new HttpClientException(422), "HttpUnprocessableEntity")
    ).toBe(false);
    expect(isBrandedAs(new HttpNotFound(), "HttpNotFound")).toBe(true);
  });

  it.each([
    ["null", null],
    ["undefined", undefined],
    ["a string", "HttpNotFound"],
    ["a plain error", new Error("HttpNotFound")],
    ["a plain object", { name: "HttpUnprocessableEntity" }],
  ])("should not match %s", (_label, value) => {
    expect(isBrandedAs(value, "HttpUnprocessableEntity")).toBe(false);
  });
});
