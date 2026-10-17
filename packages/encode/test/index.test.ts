import { Base64Atob } from "../src/base64/base64.atob";
import { Base64Node20 } from "../src/base64/base64.node20";
import { Base64Purejs } from "../src/base64/base64.purejs";
import { Base64Uint8Array } from "../src/base64/base64.uint8array";
import { Base64 } from "../src/index";
import { Base64 as Base64Browser } from "../src/index.browser";
import { Base64 as Base64Default } from "../src/index.default";
import { Base64 as Base64Uint8 } from "../src/index.uint8";

const hasNativeBase64 = typeof Uint8Array.fromBase64 === "function";
const hasBuffer = typeof globalThis.Buffer === "function";

// Mirrors the selection documented in src/index.ts
const getExpectedImplementation = () => {
  if (hasNativeBase64) {
    return { name: "uint8array", ...Base64Uint8Array };
  }
  if (hasBuffer) {
    return { name: "node20", ...Base64Node20 };
  }
  return {
    name: "purejs encode + atob decode",
    encode: Base64Purejs.encode,
    fromUint8Array: Base64Purejs.fromUint8Array,
    decode: Base64Atob.decode,
    toUint8Array: Base64Atob.toUint8Array,
  };
};

describe("Base64 (index, fastest implementation)", () => {
  const { name, encode, decode, fromUint8Array, toUint8Array } =
    getExpectedImplementation();

  it(`should pick the fastest implementation (${name})`, () => {
    expect(Base64.encode).toBe(encode);
    expect(Base64.decode).toBe(decode);
    expect(Base64.fromUint8Array).toBe(fromUint8Array);
    expect(Base64.toUint8Array).toBe(toUint8Array);
  });

  it("should encode and decode with options", () => {
    const encoded = Base64.encode("🌸", {
      alphabet: "base64url",
      omitPadding: true,
    });
    expect(encoded).toBe("8J-MuA");
    expect(Base64.decode(encoded, { alphabet: "base64url" })).toBe("🌸");
    expect(() =>
      Base64.decode("8J-MuA", { lastChunkHandling: "strict" })
    ).toThrow(/Invalid Base64 input/);
  });
});

describe.each([
  ["index.browser", Base64Browser],
  ["index.default", Base64Default],
])("Base64 (%s, fastest implementation without Buffer)", (_, base64) => {
  const expected = hasNativeBase64
    ? { name: "uint8array", ...Base64Uint8Array }
    : {
        name: "purejs encode + atob decode",
        encode: Base64Purejs.encode,
        fromUint8Array: Base64Purejs.fromUint8Array,
        decode: Base64Atob.decode,
        toUint8Array: Base64Atob.toUint8Array,
      };

  it(`should pick the fastest implementation (${expected.name})`, () => {
    expect(base64.encode).toBe(expected.encode);
    expect(base64.decode).toBe(expected.decode);
    expect(base64.fromUint8Array).toBe(expected.fromUint8Array);
    expect(base64.toUint8Array).toBe(expected.toUint8Array);
  });

  it("should encode and decode", () => {
    expect(base64.decode(base64.encode("🌸"))).toBe("🌸");
  });
});

describe("Base64 (index.uint8, bun / deno)", () => {
  it("should always use the native implementation", () => {
    expect(Base64Uint8).toBe(Base64Uint8Array);
  });

  describe.runIf(hasNativeBase64)("when the native base64 is available", () => {
    it("should encode and decode", () => {
      expect(Base64Uint8.decode(Base64Uint8.encode("🌸"))).toBe("🌸");
    });
  });
});
