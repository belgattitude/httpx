import { Base64Atob } from "../src/base64/base64.atob";

/**
 * Pitfalls of atob() / btoa(), demonstrated with the naive implementations
 * commonly found online. Each `it.fails` documents a case where the naive
 * version breaks and Base64Atob does not.
 *
 * atob() / btoa() work on "binary strings": one char per byte (0-255).
 * They know nothing about unicode, utf-8 or base64url.
 */

// btoa(str) / atob(str) used directly on text
const naive = {
  encode: (input: string): string => btoa(input),
  decode: (input: string): string => atob(input),
};

// The legacy utf-8 trick (escape / unescape are deprecated)
const legacyUriTrick = {
  // oxlint-disable-next-line typescript/no-deprecated -- demonstrates the legacy trick
  encode: (input: string): string => btoa(unescape(encodeURIComponent(input))),
  // oxlint-disable-next-line typescript/no-deprecated -- demonstrates the legacy trick
  decode: (input: string): string => decodeURIComponent(escape(atob(input))),
};

// Spreading the bytes as arguments, popular one-liner
const spreadOneLiner = (input: string): string =>
  // oxlint-disable-next-line unicorn/prefer-code-point -- demonstrates the one-liner
  btoa(String.fromCharCode(...new TextEncoder().encode(input)));

describe("atob / btoa pitfalls", () => {
  describe("characters outside latin1 (> 0xff)", () => {
    it("Base64Atob encodes emoji as utf-8", () => {
      expect(Base64Atob.encode("🌸")).toBe("8J+MuA==");
    });

    it.fails("btoa() throws InvalidCharacterError on emoji", () => {
      expect(naive.encode("🌸")).toBe("8J+MuA==");
    });
  });

  describe("latin1 characters (0x80-0xff), silent mismatch", () => {
    it("Base64Atob encodes 'é' as utf-8 (2 bytes)", () => {
      expect(Base64Atob.encode("é")).toBe("w6k=");
      expect(Base64Atob.decode("w6k=")).toBe("é");
    });

    it.fails("btoa() encodes 'é' as latin1 (1 byte), no error", () => {
      // btoa("é") === "6Q==", other implementations / languages give "w6k="
      expect(naive.encode("é")).toBe("w6k=");
    });

    it.fails("atob() returns mojibake for utf-8 text", () => {
      // atob("w6k=") === "Ã©"
      expect(naive.decode("w6k=")).toBe("é");
    });
  });

  describe("BOM (U+FEFF)", () => {
    it("Base64Atob keeps a leading BOM", () => {
      expect(Base64Atob.decode("77u/aGk=")).toBe("\uFEFFhi");
    });

    it.fails("new TextDecoder() strips a leading BOM by default", () => {
      expect(
        new TextDecoder().decode(Base64Atob.toUint8Array("77u/aGk="))
      ).toBe("\uFEFFhi");
    });
  });

  describe("lone surrogates", () => {
    it("Base64Atob replaces them with U+FFFD (like TextEncoder)", () => {
      expect(Base64Atob.encode("\uD800")).toBe("77+9");
    });

    it.fails("encodeURIComponent() throws URIError", () => {
      expect(legacyUriTrick.encode("\uD800")).toBe("77+9");
    });
  });

  describe("invalid utf-8 bytes", () => {
    it("Base64Atob decodes them as U+FFFD", () => {
      expect(Base64Atob.decode("/w==")).toBe("\uFFFD");
    });

    it("Base64Atob throws with the fatal option", () => {
      expect(() => Base64Atob.decode("/w==", { fatal: true })).toThrow(
        /Invalid UTF-8/
      );
    });

    it.fails("decodeURIComponent() throws URIError", () => {
      expect(legacyUriTrick.decode("/w==")).toBe("\uFFFD");
    });
  });

  describe("large input (~1 MB)", () => {
    const large = "a".repeat(1_000_000);

    it("Base64Atob converts the bytes by chunks", () => {
      expect(Base64Atob.encode(large)).toHaveLength(1_333_336);
    });

    it.fails("String.fromCharCode(...bytes) exceeds the call stack (RangeError)", () => {
      expect(spreadOneLiner(large)).toHaveLength(1_333_336);
    });
  });

  describe("input atob() rejects", () => {
    it("Base64Atob accepts base64url and ascii whitespace", () => {
      expect(Base64Atob.decode("8J-MuA")).toBe("🌸");
      expect(Base64Atob.decode("8J+M\nuA==\n")).toBe("🌸");
    });

    it.fails("atob() throws on base64url ('-', '_')", () => {
      expect(naive.decode("Zm9v-_8=")).toBeTypeOf("string");
    });
  });

  // Applies to every implementation: decode() / encode() convert to utf-8
  // text, which is lossy for arbitrary bytes and lone surrogates.
  describe("lossy text conversion (use toUint8Array / fromUint8Array)", () => {
    it("binary data does not survive a decode() / encode() round trip", () => {
      expect(Base64Atob.encode(Base64Atob.decode("/w=="))).toBe("77+9");
    });

    it("binary data survives a toUint8Array() / fromUint8Array() round trip", () => {
      expect(Base64Atob.fromUint8Array(Base64Atob.toUint8Array("/w=="))).toBe(
        "/w=="
      );
    });

    it("lone surrogates do not survive an encode() / decode() round trip", () => {
      expect(Base64Atob.decode(Base64Atob.encode("a\uD800b"))).toBe("a\uFFFDb");
    });
  });
});
