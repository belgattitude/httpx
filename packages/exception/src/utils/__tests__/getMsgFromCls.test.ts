import { describe, expect, it } from "vitest";

import { getMsgFromCls } from "../getMsgFromCls";

describe("getMsgFromCls", () => {
  it("should return the exception classname in natural language", () => {
    expect(getMsgFromCls("HttpImATeapot")).toBe("Im a teapot");
  });

  it("should preserve http prefix for base exceptions", () => {
    expect(getMsgFromCls("HttpException")).toBe("Http exception");
    expect(getMsgFromCls("HttpClientException")).toBe("Http client exception");
    expect(getMsgFromCls("HttpServerException")).toBe("Http server exception");
  });

  it("should preserve http prefix for HttpVersionNotSupported", () => {
    expect(getMsgFromCls("HttpVersionNotSupported")).toBe(
      "Http version not supported"
    );
  });
});
